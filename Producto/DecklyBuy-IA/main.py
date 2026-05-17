from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import shutil
import os
import uuid

app = FastAPI()

model = YOLO("yolo11n.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {"message": "API IA DecklyBuy funcionando"}

@app.post("/analyze-card")
async def analyze_card(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(file_path)

    detections = []

    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names[cls_id]

            detections.append({
                "class": class_name,
                "confidence": round(confidence, 2)
            })

    posible_carta = any(
        d["class"] in ["book", "cell phone", "remote", "tv"]
        for d in detections
    )

    if posible_carta:
        estado = "Posible carta detectada"
        score = 8.0
        mensaje = "El modelo detectó un objeto rectangular similar a una carta."
    else:
        estado = "No se pudo detectar una carta"
        score = 2.0
        mensaje = "El modelo no detectó un objeto similar a una carta."

    return {
        "estado": estado,
        "score": score,
        "posible_carta": posible_carta,
        "mensaje": mensaje,
        "detections": detections
    }