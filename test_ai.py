import cv2
import torch
import numpy as np
from flask import Flask, Response, request
from ultralytics import YOLO
import time
import os
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
from pymongo import MongoClient
from collections import deque

model_path = "D:/capstone/Capstone-Project/train_new/best_new.pt"
model = YOLO(model_path)

# ตั้งค่า AWS S3
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAU6N4A5PHMEV3HIYW',             
    aws_secret_access_key='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',          
    region_name='ap-southeast-2'                       
)
bucket_name = 'capstone-acs-falldetect'            

# ตั้งค่า MongoDB
client = MongoClient("mongodb+srv://torn_txe:1234@capstoneproject.tekjtkq.mongodb.net/?retryWrites=true&w=majority&appName=CapstoneProject")  
db = client["Capstone"]  
collection = db["fall"] 

app = Flask(__name__)

def generate_frames(source, user_id):
    if isinstance(source, str) and source.isdigit():
        source = int(source)

    stream = model.track(source=source, stream=True, imgsz=320, persist=True, verbose=False)

    buffer_seconds = 3
    fps = 10
    buffer_size = buffer_seconds * fps
    frame_buffer = deque(maxlen=buffer_size)

    fall_tracking_start = None
    fall_confirmed = False

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    for result in stream:
        frame = result.orig_img.copy()
        fall_detected_now = False
        frame_buffer.append(frame.copy())

        for box in result.boxes:
            cls = int(box.cls[0].item())
            label_name = result.names[cls]
            confidence = box.conf[0].item()
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            color = (0, 255, 0) if label_name != "fall" else (0, 0, 255)

            label_text = f"{label_name} {confidence:.2f}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            if label_name == "fall":
                fall_detected_now = True

        # ถ้ามีการล้ม เริ่มจับเวลา
        if fall_detected_now:
            if fall_tracking_start is None:
                fall_tracking_start = time.time()
            elif time.time() - fall_tracking_start >= 3.0 and not fall_confirmed:
                # การล้มต่อเนื่องครบ 3 วินาที ยืนยันการล้ม
                fall_confirmed = True
                timestamp = time.strftime("%Y%m%d-%H%M%S")
                video_filename = f"fall_{user_id}_{timestamp}.mp4"
                image_filename = f"fall_{user_id}_{timestamp}.jpg"

                h, w = frame.shape[:2]
                video_writer = cv2.VideoWriter(video_filename, fourcc, fps, (w, h))
                for buffered_frame in frame_buffer:
                    video_writer.write(buffered_frame)
                video_writer.write(frame)
                video_writer.release()

                _, img_encoded = cv2.imencode('.jpg', frame)
                img_bytes = img_encoded.tobytes()

                try:
                    s3.upload_fileobj(BytesIO(img_bytes), bucket_name, f"user_{user_id}/{image_filename}")
                    with open(video_filename, 'rb') as video_file:
                        s3.upload_fileobj(video_file, bucket_name, f"user_{user_id}/{video_filename}")

                    image_url = f"https://{bucket_name}.s3.{s3.meta.region_name}.amazonaws.com/user_{user_id}/{image_filename}"
                    video_url = f"https://{bucket_name}.s3.{s3.meta.region_name}.amazonaws.com/user_{user_id}/{video_filename}"

                    collection.insert_one({
                        "user_id": user_id,
                        "image_url": image_url,
                        "video_url": video_url,
                        "timestamp": timestamp
                    })

                    print(f"[INFO] Uploaded image + video at {timestamp}")

                except NoCredentialsError:
                    print("[ERROR] AWS credentials not found.")

        else:
            # ถ้าระหว่างรอครบ 3 วิแล้ว fall หายจะยกเลิก
            fall_tracking_start = None
            fall_confirmed = False

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    source = request.args.get('src', "0")  # default = 0
    user_id = request.args.get('user_id', None)
    return Response(generate_frames(source, user_id), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/') # ใช้ test เฉยๆ
def index():
    return """
    <html>
        <body>
            <img src='/video_feed?src=0&user_id=67ed73ae73e7097a367ed449'>
        </body>
    </html>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
