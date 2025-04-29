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

model_path = "D:/capstone/Capstone-Project/best.pt"
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
collection = db["fall_images"] 

app = Flask(__name__)

def generate_frames(source, user_id):
    if isinstance(source, str) and source.isdigit():
        source = int(source)

    fall_start_time = None
    fall_detected = False

    stream = model.track(source=source, stream=True, imgsz=320, persist=True, verbose=False)

    for result in stream:
        frame = result.orig_img.copy() 
        fall_detected_now = False

        for box in result.boxes:
            cls = int(box.cls[0].item())
            label_name = result.names[cls]
            confidence = box.conf[0].item()
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            color = (0, 255, 0) if label_name != "fall" else (0, 0, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label_text = f"{label_name} {confidence:.2f}"
            cv2.putText(frame, label_text, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # ตรวจจับการล้ม
            if label_name == "fall":
                fall_detected_now = True
                if fall_start_time is None:
                    fall_start_time = time.time()
                elif time.time() - fall_start_time >= 999999 and not fall_detected:
                    timestamp = time.strftime("%Y%m%d-%H%M%S")
                    filename = f"fall_{user_id}_{timestamp}.jpg"

                    _, img_encoded = cv2.imencode('.jpg', frame)
                    img_bytes = img_encoded.tobytes()

                    try:
                        s3.upload_fileobj(BytesIO(img_bytes), bucket_name, f"user_{user_id}/{filename}")
                        print(f"[INFO] Uploaded {filename} to S3")

                        image_url = f"https://{bucket_name}.s3.{s3.meta.region_name}.amazonaws.com/user_{user_id}/{filename}"
                        image_data = {
                            "user_id": user_id,
                            "image_url": image_url,
                            "timestamp": timestamp
                        }
                        collection.insert_one(image_data)
                    except NoCredentialsError:
                        print("[ERROR] AWS credentials not found.")

                    fall_detected = True

        if not fall_detected_now:
            fall_start_time = None
            fall_detected = False

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

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
            <img src='/video_feed?src=0&user_id=test'>
        </body>
    </html>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
