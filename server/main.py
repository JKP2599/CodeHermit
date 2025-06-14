"""
FastAPI backend for Local Code Assistant
- /generate: CrewAI GenerateReviewFlow
- /review:   CrewAI + AutoGen deep critique
- /chat:     ConversationFlow
- /metrics:  Prometheus CPU/GPU stats
Load settings from .env via python-dotenv
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from pydantic import BaseModel
from flows import GenerateReviewFlow, ConversationFlow
import psutil
import os
import subprocess
from dotenv import load_dotenv
from typing import Optional, List

class Settings(BaseSettings):
    OLLAMA_MODEL: str
    UV_PORT: int = 8000
    METRICS_ENABLED: bool = True

class PromptRequest(BaseModel):
    prompt: str
    model: Optional[str] = None

class MessageRequest(BaseModel):
    message: str
    model: Optional[str] = None

load_dotenv()
settings = Settings()
app = FastAPI(title="Local Code Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    """Serve the web interface"""
    return FileResponse("static/index.html")

@app.get("/models")
async def get_models() -> List[str]:
    """Get list of available Ollama models"""
    try:
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')[1:]  # Skip header
            models = [line.split()[0] for line in lines if line.strip()]
            return models
        return []
    except Exception as e:
        return []

@app.post("/generate")
async def generate(request: PromptRequest):
    """⇨ CREWAI FLOW: launch GenerateReviewFlow with one Coder agent"""
    flow = GenerateReviewFlow(state={})
    # Set model as env var for this request
    if request.model:
        os.environ["OLLAMA_MODEL"] = request.model
    result = flow.step_generate(request.prompt)
    # Always return a dict
    if isinstance(result, dict):
        return result
    return {"code": result, "issues": [], "status": "success"}

@app.post("/review")
async def review(request: PromptRequest):
    """⇨ CREWAI + AUTOGEN: run deep multi-agent critique"""
    flow = GenerateReviewFlow(state={})
    if request.model:
        os.environ["OLLAMA_MODEL"] = request.model
    result = flow.step_generate(request.prompt)
    review = flow.step_review(result)
    final = flow.step_finish(review)
    if isinstance(final, dict):
        return final
    return {"code": result, "issues": [review], "status": "success"}

@app.post("/chat")
async def chat(request: MessageRequest):
    """⇨ CREWAI ConversationFlow or AutoGen GroupChat based on config"""
    flow = ConversationFlow(state={})
    if request.model:
        os.environ["OLLAMA_MODEL"] = request.model
    result = flow.step_chat(request.message)
    if isinstance(result, dict):
        return result
    return {"response": result}

@app.get("/metrics")
async def metrics():
    """Return CPU/GPU usage via psutil and nvidia-smi"""
    metrics = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "gpu_metrics": {}
    }
    
    # Try to get GPU metrics if available
    try:
        import subprocess
        nvidia_smi = subprocess.check_output(["nvidia-smi", "--query-gpu=utilization.gpu,memory.used,memory.total", "--format=csv,noheader,nounits"])
        gpu_metrics = nvidia_smi.decode().strip().split(",")
        metrics["gpu_metrics"] = {
            "utilization": float(gpu_metrics[0]),
            "memory_used": float(gpu_metrics[1]),
            "memory_total": float(gpu_metrics[2])
        }
    except:
        pass
    
    return metrics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.UV_PORT) 