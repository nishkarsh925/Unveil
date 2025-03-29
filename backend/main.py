from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model import NewsBiasDetector
import pickle
import numpy as np
import json
from fastapi.responses import JSONResponse
from typing import Optional
import warnings
import sklearn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Filter scikit-learn version warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

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

def check_model_version(model_path):
    """Check if the model was trained with current scikit-learn version"""
    try:
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        # Get model metadata or version info if available
        # Not all models store version info, this is a simplified approach
        return True
    except Exception as e:
        logger.warning(f"Error checking model version: {e}")
        return False

# Load pre-trained model with version checking
def load_or_train_model():
    model_path = 'news_bias_detector.pkl'
    try:
        # Try to load the existing model
        logger.info(f"Loading model from {model_path}")
        logger.info(f"Current scikit-learn version: {sklearn.__version__}")
        
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            detector.load_model(model_path)
            
            # Check if we got version warnings
            version_warning = any("InconsistentVersionWarning" in str(warning.message) for warning in w)
            
            if version_warning:
                logger.warning("Model was trained with a different scikit-learn version. Consider retraining.")
        
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        logger.info("Training new model...")
        # Train a new model
        df = detector.load_existing_datasets()
        X, y = detector.prepare_dataset(df)
        detector.train_word_embeddings(df['processed_text'])
        detector.train_model(X, y)
        detector.save_model(model_path)
        logger.info("New model trained and saved")

# Call the load or train function
load_or_train_model()

class ArticleRequest(BaseModel):
    text: str

class StoriesRequest(BaseModel):
    category: Optional[str] = None
    query: Optional[str] = None
    count: Optional[int] = 10

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

@app.post("/stories")
async def get_stories(request: StoriesRequest):
    try:
        stories = detector.fetch_stories(
            category=request.category,
            query=request.query,
            count=request.count
        )
        
        # Convert numpy types to Python native types
        converted_stories = convert_numpy_types(stories)
        
        return converted_stories
    except Exception as e:
        print(f"Error fetching stories: {str(e)}")
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