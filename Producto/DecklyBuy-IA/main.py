from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import shutil
import os
import uuid

app = FastAPI()

# modelo entranado
model = YOLO("models/decklybuy_condition_v1.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# puntaje asociado
SCORES = {
    "Mint": 10.0,
    "Near_mint": 9.0,
    "Lightly_played": 7.0,
    "Moderately_played": 5.0,
    "Heavily_played": 3.0,
    "Damaged": 1.0
}

# para formato de texto
DISPLAY_NAMES = {
    "Mint": "Mint",
    "Near_mint": "Near Mint",
    "Lightly_played": "Lightly Played",
    "Moderately_played": "Moderately Played",
    "Heavily_played": "Heavily Played",
    "Damaged": "Damaged"
}


# servicio funcionandp
@app.get("/")
def home():
    return {
        "message": "API IA DecklyBuy funcionando",
        "model": "decklybuy_condition_v1",
        "type": "classification"
    }


# analizar carta 
@app.post("/analyze-card")
async def analyze_card(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"

    # para guardar imagen subida
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    results = model(file_path)
    result = results[0]

    # obtener prob de clasificacion
    probs = result.probs

    top1_id = int(probs.top1)
    top1_confidence = float(probs.top1conf)
    predicted_class = model.names[top1_id]

    estado = DISPLAY_NAMES.get(predicted_class, predicted_class)
    score = SCORES.get(predicted_class, 0.0)


    predictions = []

    for class_id in probs.top5:
        class_id = int(class_id)
        class_name = model.names[class_id]
        confidence = float(probs.data[class_id])

        predictions.append({
            "class": DISPLAY_NAMES.get(class_name, class_name),
            "raw_class": class_name,
            "confidence": f"{round(confidence * 100)}%"
        })

    return {
        "estado": estado,
        "score": score,
        "confidence": f"{round(top1_confidence * 100, 1)}%",
        "mensaje": f"La carta fue clasificada como {estado}.",
        "model": "decklybuy_condition_v1",
        "predictions": predictions
    }
