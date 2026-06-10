from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import shutil
import os
import uuid

app = FastAPI()

# Ruta configurable del modelo.
MODEL_PATH = os.getenv("MODEL_PATH", "models/decklybuy_condition_v2.pt")

model = YOLO(MODEL_PATH)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

SCORES = {
    "Mint": 10.0,
    "Near_mint": 9.0,
    "Lightly_played": 7.0,
    "Moderately_played": 5.0,
    "Heavily_played": 3.0,
    "Damaged": 1.0,
    "Invalid_card": 0.0,
    "Not_card": 0.0
}

DISPLAY_NAMES = {
    "Mint": "Mint",
    "Near_mint": "Near Mint",
    "Lightly_played": "Lightly Played",
    "Moderately_played": "Moderately Played",
    "Heavily_played": "Heavily Played",
    "Damaged": "Damaged",
    "Invalid_card": "Invalid Card",
    "Not_card": "Not Card"
}


@app.get("/")
def home():
    return {
        "message": "API IA DecklyBuy funcionando",
        "model": "decklybuy_condition_v2",
        "type": "classification"
    }


def save_upload_file(file: UploadFile) -> str:
    file_id = str(uuid.uuid4())
    safe_filename = file.filename or "uploaded_image.jpg"
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{safe_filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def run_prediction(file_path: str):
    results = model(file_path)
    result = results[0]
    probs = result.probs

    top1_id = int(probs.top1)
    top1_confidence = float(probs.top1conf)
    predicted_class = model.names[top1_id]

    estado = DISPLAY_NAMES.get(predicted_class, predicted_class)
    score = SCORES.get(predicted_class, 0.0)
    confidence = f"{round(top1_confidence * 100, 1)}%"

    return probs, predicted_class, estado, score, confidence, top1_confidence


@app.post("/analyze-card")
async def analyze_card(file: UploadFile = File(...)):
    file_path = save_upload_file(file)

    try:
        probs, predicted_class, estado, score, confidence, top1_confidence = run_prediction(file_path)

        predictions = []

        for class_id in probs.top5:
            class_id = int(class_id)
            class_name = model.names[class_id]
            class_confidence = float(probs.data[class_id])

            predictions.append({
                "class": DISPLAY_NAMES.get(class_name, class_name),
                "raw_class": class_name,
                "confidence": f"{round(class_confidence * 100)}%"
            })

        return {
            "estado": estado,
            "score": score,
            "confidence": confidence,
            "mensaje": f"La carta fue clasificada como {estado}.",
            "model": "decklybuy_condition_v2",
            "predictions": predictions
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/detect-score")
async def detect_score(file: UploadFile = File(...)):
    file_path = save_upload_file(file)

    try:
        probs, predicted_class, estado, score, confidence, top1_confidence = run_prediction(file_path)

        if top1_confidence < 0.50:
            return {
                "valid": False,
                "estado": "Invalid Card",
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "No se pudo analizar la imagen con suficiente confianza. Intenta subir una foto más clara, centrada y completa."
            }

        if predicted_class == "Invalid_card":
            return {
                "valid": False,
                "estado": estado,
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "La imagen contiene una carta, pero no es válida para analizar. Intenta tomar otra foto más clara, centrada y completa."
            }

        if predicted_class == "Not_card":
            return {
                "valid": False,
                "estado": estado,
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "La imagen no corresponde a una carta Pokémon TCG. Intenta subir otra foto."
            }

        return {
            "valid": True,
            "estado": estado,
            "score": score,
            "confidence": confidence,
            "mensaje": "Carta TCG analizada correctamente."
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)