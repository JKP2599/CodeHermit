"""
FastAPI backend for Local Code Assistant
- /generate: CrewAI GenerateReviewFlow
- /review:   CrewAI + AutoGen deep critique
- /chat:     ConversationFlow
- /metrics:  Prometheus CPU/GPU stats
- /embed:    File embedding
- /execute:  Code execution
- /analyze:  Code analysis
Load settings from .env via python-dotenv
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from pydantic import BaseModel
from flows import GenerateReviewFlow, ConversationFlow
from code_assistant_rust import (
    get_system_metrics,
    get_ollama_models,
    execute_code,
    analyze_code,
    index_and_embed
)
import os
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any

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

class CodeRequest(BaseModel):
    code: str
    timeout_ms: Optional[int] = 5000

class EmbedRequest(BaseModel):
    path: str

load_dotenv()
settings = Settings()
app = FastAPI(title="Local Code Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return get_ollama_models()

@app.post("/generate")
async def generate(request: PromptRequest):
    """⇨ CREWAI FLOW: launch GenerateReviewFlow with one Coder agent"""
    flow = GenerateReviewFlow(state={})
    if request.model:
        os.environ["OLLAMA_MODEL"] = request.model
    result = flow.step_generate(request.prompt)
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
async def metrics() -> Dict[str, Any]:
    """Return CPU/GPU usage via Rust implementation"""
    return get_system_metrics()

@app.post("/embed")
async def embed(request: EmbedRequest):
    """Index and embed files from a directory"""
    try:
        index_and_embed(request.path, ".chroma")
        return {"status": "success", "message": f"Indexed {request.path}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/execute")
async def execute(request: CodeRequest):
    """Execute code in a sandboxed environment"""
    return execute_code(request.code, request.timeout_ms)

@app.post("/analyze")
async def analyze(request: CodeRequest):
    """Analyze code complexity and metrics"""
    return analyze_code(request.code)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.UV_PORT) 