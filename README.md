# Smart Closet

An embedded AI-powered outfit recommendation system that runs entirely on-device using Raspberry Pi, Google Coral Edge TPU, and a full-stack React + Node.js application.

--- 

## Overview

Smart Closet captures clothing metadata via Pi cameras, ingests live weather data and user feedback, and runs three reinforcement-learning models (color, weather, style) on a Coral Edge TPU for low-latency, on-device outfit recommendations.

---

## Hardware Components

- **Raspberry Pi 4B (8GB) & Zero W**  
- **5″ HDMI Touchscreen Display**  
- **Raspberry Pi Camera Modules (x2)**  
- **Google Coral USB Edge TPU**

---

## Software Stack

- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Persistence:** JSON files via custom file-server  
- **ML Inference & Training:** TensorFlow → INT8 TFLite → Coral Edge TPU  
- **Containerization:** Docker / Docker Compose (ARM64)  
- **Weather API:** Open-Meteo  
