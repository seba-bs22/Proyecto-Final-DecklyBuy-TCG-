from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import os
import uuid

app = FastAPI(
    title="DecklyBuy IA Service",
    description="Servicio de clasificación de condición de cartas TCG",
    version="1.0.0"
)


cors_origins_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,https://localhost:5173"
)

allowed_origins = [
    origin.strip()
    for origin in cors_origins_env.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# Modelo IA
# ================================
MODEL_PATH = os.getenv("MODEL_PATH", "models/decklybuy_condition_v3.pt")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo IA en: {MODEL_PATH}")

model = YOLO(MODEL_PATH)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================================
# Puntajes
# ================================
SCORES = {
    "Mint": 10.0,
    "Near_mint": 9.0,
    "Lightly_played": 7.0,
    "Moderately_played": 5.0,
    "Heavily_played": 3.0,
    "Damaged": 1.0,
    "Invalid_card": 0.0,
    "Not_card": 0.0,
}

DISPLAY_NAMES = {
    "Mint": "Mint",
    "Near_mint": "Near Mint",
    "Lightly_played": "Lightly Played",
    "Moderately_played": "Moderately Played",
    "Heavily_played": "Heavily Played",
    "Damaged": "Damaged",
    "Invalid_card": "Invalid Card",
    "Not_card": "Not Card",
}


def save_upload_file(file: UploadFile) -> str:
    file_id = str(uuid.uuid4())
    safe_filename = file.filename or "uploaded_image.jpg"
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{safe_filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def analyze_image(file_path: str):
    results = model(file_path)
    result = results[0]

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
        "predicted_class": predicted_class,
        "estado": estado,
        "score": score,
        "top1_confidence": top1_confidence,
        "confidence": f"{round(top1_confidence * 100, 1)}%",
        "predictions": predictions,
    }


@app.get("/")
def home():
    return {
        "message": "API IA DecklyBuy funcionando",
        "model": "decklybuy_condition_v3",
        "type": "classification",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "decklybuy-ia",
        "model": "decklybuy_condition_v3"
    }


@app.post("/api/ia/analyze-card")
async def analyze_card(file: UploadFile = File(...)):
    file_path = save_upload_file(file)

    try:
        analysis = analyze_image(file_path)

        return {
            "estado": analysis["estado"],
            "score": analysis["score"],
            "confidence": analysis["confidence"],
            "mensaje": f"La carta fue clasificada como {analysis['estado']}.",
            "model": "decklybuy_condition_v3",
            "predictions": analysis["predictions"]
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/api/ia/detect-score")
async def detect_score(file: UploadFile = File(...)):
    file_path = save_upload_file(file)

    try:
        analysis = analyze_image(file_path)

        predicted_class = analysis["predicted_class"]
        estado = analysis["estado"]
        score = analysis["score"]
        top1_confidence = analysis["top1_confidence"]
        confidence = analysis["confidence"]

        # Confianza muy baja
        if top1_confidence < 0.50:
            return {
                "valid": False,
                "estado": "Invalid Card",
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "No se pudo analizar la imagen con suficiente confianza. Intenta subir una foto más clara, centrada y completa."
            }

        # Imagen contiene una carta, pero no es válida para analizar
        if predicted_class == "Invalid_card":
            return {
                "valid": False,
                "estado": estado,
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "La imagen contiene una carta, pero no es válida para analizar. Intenta tomar otra foto más clara, centrada y completa."
            }

        # Imagen no corresponde a carta
        if predicted_class == "Not_card":
            return {
                "valid": False,
                "estado": estado,
                "score": 0.0,
                "confidence": confidence,
                "mensaje": "La imagen no corresponde a una carta Pokémon TCG. Intenta subir otra foto."
            }

        # Imagen de carta válida
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