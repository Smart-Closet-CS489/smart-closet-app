import io
import logging
import socketserver
from http import server
from threading import Condition
import time

from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput
from PIL import Image

isStreaming = True;
takePhoto = False;

PAGE = """\
<html>
<head>
<title>picamera2 MJPEG streaming demo</title>
</head>
<body>
<h1>Picamera2 MJPEG Streaming Demo</h1>
<img src="stream.mjpg" width="640" height="480" />
</body>
</html>
"""

class StreamingOutput(io.BufferedIOBase):
    def __init__(self):
        self.frame = None
        self.condition = Condition()

    def write(self, buf):
        with self.condition:
            self.frame = buf
            self.condition.notify_all()

take_photo = False;

class StreamingHandler(server.BaseHTTPRequestHandler):
    def do_GET(self):
        print(self.path)
        print("streaming resumed")
        # Display stream
 # Display streami
        global take_photo;
        global isStreaming;

        if self.path == '/stream.mjpg':
            self.send_response(200)
            self.send_header('Age', 0)
            self.send_header('Cache-Control', 'no-cache, private')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()
            try:
                while True:
                    if isStreaming:
                        with output.condition:
                            output.condition.wait()
                            frame = output.frame
                        self.wfile.write(b'--FRAME\r\n')
                        self.send_header('Content-Type', 'image/jpeg')
                        self.send_header('Content-Length', len(frame))
                        self.end_headers() 
                        self.wfile.write(frame)
                        self.wfile.write(b'\r\n')

                    elif take_photo:
                        picam2.capture_file("photo_from_stream.jpg")
                        with open("photo_from_stream.jpg", 'rb') as f:
                            image_bytes = f.read()
                        self.wfile.write(b'--FRAME\r\n')
                        self.send_header('Content-Type', 'image/jpeg')
                        self.send_header('Content-Length', len(image_bytes))
                        self.end_headers()
                        self.wfile.write(image_bytes)
                        self.wfile.write(b'\r\n')
                        take_photo = False
                
            except Exception as e:
                logging.warning(
                    'Removed streaming client %s: %s',
                    self.client_address, str(e))

        if self.path == '/set-isstreaming-false':
            take_photo = True
            isStreaming = False

        if self.path == '/set-isstreaming-true':
            isStreaming = True




class StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration(main={"size": (640, 480)}))
output = StreamingOutput()
picam2.start_recording(JpegEncoder(), FileOutput(output)) 
try:
    address = ('', 7123)
    server = StreamingServer(address, StreamingHandler)
    server.serve_forever()
finally:
    picam2.stop_recording() 
