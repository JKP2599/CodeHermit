# Installation Guide

This guide will help you set up CodeHermit on your local machine. The application consists of two main components: a FastAPI backend and a React frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.10 or higher**
   ```bash
   python --version
   ```

2. **Node.js 18 or higher**
   ```bash
   node --version
   ```

3. **npm 9 or higher**
   ```bash
   npm --version
   ```

4. **Ollama**
   - Visit [Ollama's official website](https://ollama.ai) to download and install
   - For Linux:
     ```bash
     curl https://ollama.ai/install.sh | sh
     ```
   - For macOS:
     ```bash
     brew install ollama
     ```

5. **Git**
   ```bash
   git --version
   ```

## Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codehermit.git
   cd codehermit
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Linux/macOS
   python -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create a .env file in the server directory
   cp .env.example .env
   ```
   
   Edit the `.env` file with your preferred settings:
   ```env
   OLLAMA_MODEL=llama2
   OLLAMA_BASE_URL=http://localhost:11434
   UV_PORT=8000
   UV_HOST=0.0.0.0
   UV_RELOAD=true
   METRICS_ENABLED=true
   GPU_METRICS_ENABLED=true
   ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

5. **Download Ollama model**
   ```bash
   ollama pull llama2
   ```

## Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   # Create a .env file in the frontend directory
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

## Starting the Application

1. **Start the backend server**
   ```bash
   # From the server directory
   cd server
   source venv/bin/activate 
   uvicorn main:app --reload
   ```

2. **Start the frontend development server**
   ```bash
   # From the frontend directory
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API docs: http://localhost:8000/docs

## Troubleshooting

### Common Issues

1. **Port conflicts**
   - If port 8000 is in use, modify the `UV_PORT` in `.env`
   - If port 5173 is in use, modify the Vite port in `package.json`

2. **Ollama connection issues**
   - Ensure Ollama is running: `ollama serve`
   - Check if the model is downloaded: `ollama list`

3. **Python dependency issues**
   - Try updating pip: `pip install --upgrade pip`
   - Recreate virtual environment if needed

4. **Node.js dependency issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

### System Requirements

- **Minimum:**
  - 4GB RAM
  - 2 CPU cores
  - 10GB free disk space

- **Recommended:**
  - 8GB RAM
  - 4 CPU cores
  - 20GB free disk space
  - NVIDIA GPU (for better performance)

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Keep API keys and sensitive data secure

2. **Network Security**
   - The application runs locally by default
   - If exposing to network, use proper authentication

3. **Model Security**
   - Keep Ollama models updated
   - Monitor system resources

## Support

If you encounter any issues:
1. Check the [Known Issues](#known-issues) section
2. Search existing [GitHub Issues](https://github.com/yourusername/codehermit/issues)
3. Create a new issue with detailed information about your problem

## Next Steps

After installation, proceed to [USAGE.md](USAGE.md) for detailed usage instructions. 