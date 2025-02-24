from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model import NewsBiasDetector
import pickle
import numpy as np
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom JSON encoder to handle numpy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.bool_):
            return bool(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

# Initialize model
detector = NewsBiasDetector()

# Load pre-trained model
try:
    detector.load_model('news_bias_detector.pkl')
except:
    # If no model exists, train a new one
    df = detector.load_existing_datasets()
    X, y = detector.prepare_dataset(df)
    detector.train_word_embeddings(df['processed_text'])
    detector.train_model(X, y)
    detector.save_model('news_bias_detector.pkl')

class ArticleRequest(BaseModel):
    text: str

def convert_numpy_types(obj):
    """Recursively convert numpy types to Python native types"""
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

@app.post("/analyze")
async def analyze_article(article: ArticleRequest):
    try:
        # Get analysis from the model
        analysis = detector.analyze_article(article.text)
        
        # Convert numpy types to Python native types
        converted_analysis = convert_numpy_types(analysis)
        
        return converted_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Custom error handler for validation errors
@app.exception_handler(ValueError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": str(exc)},
    )