# CodeHermit Backend

A FastAPI backend for the CodeHermit local AI coding assistant.

## Features

- 🚀 FastAPI for high-performance API endpoints
- 🤖 CrewAI and AutoGen integration for AI-powered code generation and review
- 💬 Real-time chat capabilities
- 📊 System metrics monitoring
- 🔒 Local model inference with Ollama
- 🔄 CORS support for frontend integration

## Prerequisites

- Python 3.10+
- Ollama installed and running
- NVIDIA GPU (optional, for GPU metrics)

## Getting Started

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # or
   .\venv\Scripts\activate  # Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file:
   ```env
   OLLAMA_MODEL=llama2
   UV_PORT=8000
   METRICS_ENABLED=true
   ```

4. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /models` - List available Ollama models
- `POST /generate` - Generate code from a prompt
- `POST /review` - Review code and provide feedback
- `POST /chat` - Chat with the AI assistant
- `GET /metrics` - Get system metrics (CPU, memory, GPU)

## Project Structure

```
server/
  ├── main.py           # FastAPI application
  ├── flows.py          # CrewAI and AutoGen workflows
  ├── static/          # Static files (if any)
  └── requirements.txt  # Python dependencies
```

## Development

The backend is built with:

- [FastAPI](https://fastapi.tiangolo.com/)
- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [AutoGen](https://github.com/microsoft/autogen)
- [Ollama](https://ollama.ai/)
- [Uvicorn](https://www.uvicorn.org/)

## API Documentation

Once the server is running, you can access:
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 