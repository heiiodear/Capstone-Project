import cv2
import torch
import numpy as np
from flask import Flask, Response, request
from ultralytics import YOLO

model_path = "D:/cap/Capstone-Project/best.pt"
model = YOLO(model_path)

app = Flask(__name__)

def generate_frames(source):
    cap = cv2.VideoCapture(source)
    if source == '0' :
        cap = cv2.VideoCapture(1)

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)[0]
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = box.conf[0].item()
            cls = int(box.cls[0].item())
            label = f"{results.names[cls]}: {confidence:.2f}"

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():                                                                                                                                                                                                               
    source = request.args.get('src', "0")  # default = 0
    return Response(generate_frames(source), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return """
    <html>
        <body>
            <img src='/video_feed?src=0'>
        </body>
    </html>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
