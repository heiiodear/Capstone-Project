import time
import cv2
import subprocess

camera_index = 0
cap = cv2.VideoCapture(camera_index)

if not cap.isOpened():
    print(f"ไม่สามารถเปิดกล้องหมายเลข {camera_index} ได้")
    exit()

width = 640
height = 640
fps = 30

ffmpeg_command = [
    'ffmpeg',
    '-f', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', f'{width}x{height}',
    '-r', str(fps),
    '-i', '-',
    '-c:v', 'h264_qsv', 
    '-preset', 'veryfast',
    '-tune', 'zerolatency', 
    '-profile:v', 'high',   
    '-g', '25',
    '-keyint_min', '25',
    '-b:v', '1500k',
    '-bufsize', '1500k',
    '-bf', '0',
    '-threads', '1',
    '-vsync', '1',
    '-x264opts', 'keyint=25',  
    '-bsf:v', 'h264_mp4toannexb',  
    '-f', 'rtsp',
    '-rtsp_transport', 'tcp',
    'rtsp://localhost:8554/live'
]

process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE)

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("ไม่สามารถอ่านภาพจากกล้องได้")
            break

        frame = cv2.resize(frame, (width, height))

        if process.poll() is not None:
            print("FFmpeg process ถูกปิด")
            break

        try:
            process.stdin.write(frame.tobytes())
        except (BrokenPipeError, IOError):
            print("ไม่สามารถส่งข้อมูลไปยัง FFmpeg ได้ (Broken Pipe)")
            break

        time.sleep(0.8)

finally:
    cap.release()
    if process.stdin:
        process.stdin.close()
    process.wait()
