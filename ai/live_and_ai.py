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
from threading import Thread, Event
from queue import Queue
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from torch.cuda.amp import autocast

executor = ThreadPoolExecutor(max_workers=5)

load_dotenv()

app = Flask(__name__)
CORS(app)

stream_queues = {}
stream_caps = {}
stream_threads = {}
stop_events = {}  

# โหลดโมเดล YOLO
current_file = Path(__file__).resolve()
model_path = current_file.parent / "model_11n-new.pt"
model = YOLO(model_path)

print("Model task:", model.task)

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
db = "Capstone"
collection = "fall"

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

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model.to(device)

def process_frame(frame):
    with autocast():
        results = model.predict(frame, 
                                conf=0.4, 
                                iou=0.4, 
                                imgsz=320, 
                                device=device,
                                stream=True,
                                verbose=False,
                                )
    
    return frame, results

SKELETON_CONNECTIONS = [
    (0, 1), (0, 2), (1, 3), (2, 4),           # Face
    (5, 6),                                   # Shoulders
    (5, 7), (7, 9),                           # Left Arm
    (6, 8), (8, 10),                          # Right Arm
    (5, 11), (6, 12), (11, 12),               # Torso
    (11, 13), (13, 15),                       # Left Leg
    (12, 14), (14, 16)                        # Right Leg
]

def draw_skeleton(frame, keypoints, connections, color):
    if keypoints is not None and len(keypoints.shape) > 1 and keypoints.shape[1] >= 3:
        for start_idx, end_idx in connections:
            if start_idx < len(keypoints) and end_idx < len(keypoints):
                if keypoints[start_idx][2] > 0.5 and keypoints[end_idx][2] > 0.5:
                    x1, y1 = int(keypoints[start_idx][0]), int(keypoints[start_idx][1])
                    x2, y2 = int(keypoints[end_idx][0]), int(keypoints[end_idx][1])
                    cv2.line(frame, (x1, y1), (x2, y2), color, 2)

def draw_keypoints(frame, keypoints_list, color=(255, 0, 255), radius=3):
    for keypoints in keypoints_list:
        if keypoints is not None and len(keypoints.shape) > 1:
            for x, y, conf in keypoints:
                if conf > 0.5: 
                    cv2.circle(frame, (int(x), int(y)), radius, color, -1)

def generate_frames(source, user_id):
    if isinstance(source, str) and source.isdigit():
        source = int(source)

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        return

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
            keypoints = result.keypoints 

            if boxes is not None:
                for i, box in enumerate(boxes):
                    cls = int(box.cls[0].item())
                    label_name = result.names[cls]
                    confidence = box.conf[0].item()
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    color = (0, 255, 0) if label_name != "fall" else (0, 0, 255)

                    label_text = f"{label_name} {confidence:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, label_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                    if keypoints is not None and i < len(keypoints.data):
                        kpts = keypoints.data[i].cpu().numpy().reshape(-1, 3)
                        draw_keypoints(frame, [kpts]) 
                        draw_skeleton(frame, kpts, SKELETON_CONNECTIONS, color) 

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

def generate_stream(source, user_id):
    key = (user_id, str(source))
    q = Queue(maxsize=10)
    stream_queues[key] = q  
    stop_event = Event()
    stop_events[key] = stop_event

    def worker():
        for frame in generate_frames(source, user_id):
            if stop_event.is_set():
                break  
            if q.full():
                try:
                    q.get_nowait()
                except:
                    pass
            q.put(frame)
        q.put(None)
        stop_events.pop(key, None)

    thread = Thread(target=worker, daemon=True)
    thread.start()
    stream_threads[key] = thread

@app.route('/video_feed')
def video_feed():
    source = request.args.get('src', "0")
    user_id = request.args.get('user_id', "anonymous")
    key = (user_id, str(source))  

    if key not in stream_queues:
        generate_stream(source, user_id)

    def stream():
        while True:
            frame = stream_queues[key].get()  
            if frame is None:
                break
            yield frame

    return Response(stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/clear_camera')
def clear_camera():
    src = request.args.get('src')
    user_id = request.args.get('user_id')
    key = (user_id, str(src))

    if key in stream_threads:
        if key in stop_events:
            stop_events[key].set()

        if key in stream_caps:
            stream_caps[key].release()
            stream_caps.pop(key)

        stream_threads.pop(key)
        stream_queues.pop(key, None) 
        stop_events.pop(key, None)

        return {"status": "camera cleared"}, 200
    else:
        return {"error": "camera not found"}, 404

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
