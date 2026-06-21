from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import os
import uuid

app = FastAPI()

# Configuracion de seguridad CORS para desarrollo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# modelo entranado
model = YOLO("models/decklybuy_condition_v2.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# puntaje asociado
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

# para formato de texto
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


# servicio funcionandp
@app.get("/")
def home():
    return {
        "message": "API IA DecklyBuy funcionando",
        "model": "decklybuy_condition_v2",
        "type": "classification"
    }


# analizar carta 
@app.post("/api/ia/analyze-card")
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
        "model": "decklybuy_condition_v2",
        "predictions": predictions
    }


# para devolver a backend
@app.post("/api/ia/detect-score")
async def detect_score(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(file_path)
    result = results[0]

    probs = result.probs

    top1_id = int(probs.top1)
    top1_confidence = float(probs.top1conf)
    predicted_class = model.names[top1_id]

    estado = DISPLAY_NAMES.get(predicted_class, predicted_class)
    score = SCORES.get(predicted_class, 0.0)
    confidence = f"{round(top1_confidence * 100, 1)}%"

    # confianza muy baja, carta invalida
    if top1_confidence < 0.50:
        return {
            "valid": False,
            "estado": "Invalid Card",
            "score": 0.0,
            "confidence": confidence,
            "mensaje": "No se pudo analizar la imagen con suficiente confianza. Intenta subir una foto más clara, centrada y completa."
        }

    # imagen no valida 
    if predicted_class == "Invalid_card":
        return {
            "valid": False,
            "estado": estado,
            "score": 0.0,
            "confidence": confidence,
            "mensaje": "La imagen contiene una carta, pero no es válida para analizar. Intenta tomar otra foto más clara, centrada y completa."
        }

    # imagen no corresponde a carta 
    if predicted_class == "Not_card":
        return {
            "valid": False,
            "estado": estado,
            "score": 0.0,
            "confidence": confidence,
            "mensaje": "La imagen no corresponde a una carta Pokémon TCG. Intenta subir otra foto."
        }

    # imagen de carta valida
    return {
        "valid": True,
        "estado": estado,
        "score": score,
        "confidence": confidence,
        "mensaje": "Carta TCG analizada correctamente."
    }