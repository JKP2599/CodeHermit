"""
Tests for API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from main import app
import os
import tempfile
import json

client = TestClient(app)

@pytest.fixture
def test_workspace():
    """Create a temporary workspace with test files."""
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create some test files
        test_file = os.path.join(temp_dir, "test.py")
        with open(test_file, "w") as f:
            f.write("""
def hello():
    print("Hello, World!")
    return True
            """)
        yield temp_dir

def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_models():
    """Test models endpoint."""
    response = client.get("/models")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_generate():
    """Test code generation endpoint."""
    response = client.post("/generate", json={
        "prompt": "Create a function that adds two numbers",
        "model": "codellama:7b-instruct"
    })
    assert response.status_code == 200
    data = response.json()
    assert "code" in data
    assert "issues" in data
    assert "status" in data

def test_review():
    """Test code review endpoint."""
    response = client.post("/review", json={
        "prompt": "Create a function that adds two numbers",
        "model": "codellama:7b-instruct"
    })
    assert response.status_code == 200
    data = response.json()
    assert "code" in data
    assert "issues" in data
    assert "status" in data

def test_chat():
    """Test chat endpoint."""
    response = client.post("/chat", json={
        "message": "How do I write a Python function?",
        "model": "codellama:7b-instruct"
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data

def test_metrics():
    """Test metrics endpoint."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "cpu_percent" in data
    assert "memory_percent" in data
    assert "gpu_metrics" in data

def test_embed(test_workspace):
    """Test file embedding endpoint."""
    response = client.post("/embed", json={
        "path": test_workspace
    })
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"

def test_execute():
    """Test code execution endpoint."""
    response = client.post("/execute", json={
        "code": "print('Hello, World!')",
        "timeout_ms": 5000
    })
    assert response.status_code == 200
    data = response.json()
    assert "stdout" in data
    assert "stderr" in data
    assert "exit_code" in data
    assert "duration_ms" in data

def test_analyze():
    """Test code analysis endpoint."""
    response = client.post("/analyze", json={
        "code": """
def complex_function():
    for i in range(10):
        for j in range(10):
            if i > j:
                print(i * j)
        """,
        "timeout_ms": 5000
    })
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "duration_ms" in data
    metrics = data["metrics"]
    assert "total_lines" in metrics
    assert "function_count" in metrics
    assert "class_count" in metrics
    assert "cyclomatic_complexity" in metrics

def test_error_handling():
    """Test error handling for invalid requests."""
    # Test invalid JSON
    response = client.post("/generate", data="invalid json")
    assert response.status_code == 422

    # Test missing required fields
    response = client.post("/generate", json={})
    assert response.status_code == 422

    # Test invalid workspace path
    response = client.post("/embed", json={
        "path": "/nonexistent/path"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "error"

    # Test code execution timeout
    response = client.post("/execute", json={
        "code": "import time; time.sleep(10)",
        "timeout_ms": 100
    })
    assert response.status_code == 200
    data = response.json()
    assert data["exit_code"] != 0 