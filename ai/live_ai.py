import os
import cv2
import torch
import numpy as np
from dotenv import load_dotenv
from flask import Flask, Response, render_template, request
from ultralytics import YOLO
import time
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
from pymongo import MongoClient
from collections import deque
from flask_cors import CORS
from threading import Thread
from queue import Queue
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

executor = ThreadPoolExecutor(max_workers=5)

load_dotenv()

app = Flask(__name__)
CORS(app)

stream_queues = {}

# โหลดโมเดล YOLO
current_file = Path(__file__).resolve()
model_path = current_file.parent / "model_11n320.pt"
model = YOLO(model_path)

# ตั้งค่า AWS S3
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)
bucket_name = os.getenv("AWS_BUCKET_NAME")

# ตั้งค่า MongoDB
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB")]
collection = db[os.getenv("MONGODB_COLLECTION")]

# ปรับขนาดภาพ
# def resize_frame(frame, target_width=640):
#     height, width = frame.shape[:2]
#     aspect_ratio = width / height
#     target_height = int(target_width / aspect_ratio)
#     return cv2.resize(frame, (target_width, target_height))

# ปรับแสง
def auto_brightness(frame, target_brightness=100):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)

    if brightness < target_brightness:
        gamma = target_brightness / max(brightness, 1)
        gamma = min(gamma, 3.0)
        look_up_table = np.array([((i / 255.0) ** (1.0 / gamma)) * 255 for i in np.arange(0, 256)]).astype("uint8")
        return cv2.LUT(frame, look_up_table)
    else:
        return frame

# ประมวลผลภาพ
def process_frame(frame):
    frame = auto_brightness(frame)
    # frame = resize_frame(frame)
    results = model.predict(frame, 
                            conf=0.5, 
                            iou=0.5, 
                            stream=True, 
                            imgsz=320,
                            verbose=False)
    return frame, results

# สำหรับสร้างเฟรม
def generate_frames(source, user_id):
    if isinstance(source, str) and source.isdigit():
        source = int(source)

    cap = cv2.VideoCapture(source)

    buffer_seconds = 3
    fps = 10
    buffer_size = buffer_seconds * fps
    frame_buffer = deque(maxlen=buffer_size)

    fall_tracking_start = None
    fall_confirmed = False

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        future = executor.submit(process_frame, frame)
        frame, results = future.result()
        fall_detected_now = False
        frame_buffer.append(frame.copy())

        for result in results:
            boxes = result.boxes
            for box in boxes:
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

        if fall_detected_now:
            if fall_tracking_start is None:
                fall_tracking_start = time.time()
            elif time.time() - fall_tracking_start >= 3.0 and not fall_confirmed:
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
                        "note": "",
                        "timestamp": timestamp
                    })

                    print(f"[INFO] Uploaded image + video at {timestamp}")

                except NoCredentialsError:
                    print("[ERROR] AWS credentials not found.")
        else:
            fall_tracking_start = None
            fall_confirmed = False

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

# สำหรับจัดการสตรีม
def generate_stream(source, user_id):
    q = Queue(maxsize=1)
    stream_queues[user_id] = q

    def worker():
        for frame in generate_frames(source, user_id):
            if q.full():
                try:
                    q.get_nowait()
                except:
                    pass
            q.put(frame)
        q.put(None)

    Thread(target=worker, daemon=True).start()

@app.route('/video_feed')
def video_feed():
    source = request.args.get('src', "0")
    user_id = request.args.get('user_id', "anonymous")

    if user_id not in stream_queues:
        generate_stream(source, user_id)

    def stream():
        while True:
            frame = stream_queues[user_id].get()
            if frame is None:
                break
            yield frame

    return Response(stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
