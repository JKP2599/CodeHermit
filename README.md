# CodeHermit

[![Project Status](https://img.shields.io/badge/status-Actively%20Maintained-brightgreen)](https://github.com/yourusername/codehermit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A local-first AI coding assistant with a modern web interface.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Overview

CodeHermit is a powerful, privacy-focused coding assistant that brings AI-powered development support to your local environment. By leveraging CrewAI, AutoGen, and Ollama for local model inference, it provides intelligent code generation, review, and assistance while maintaining complete privacy and control over your development process. The modern web interface makes it accessible from any browser, with real-time system metrics and model management.

## Key Features

- 🤖 **AI-Driven Code Generation**: Deep context awareness for intelligent code suggestions
- 👥 **Multi-Agent Code Review**: Collaborative code analysis using AutoGen
- 💬 **Interactive Chat Interface**: Real-time development support and guidance
- 📊 **System Monitoring**: Real-time CPU, memory, and GPU metrics
- 🔒 **Local Model Inference**: Privacy-focused development with Ollama
- 📚 **Context Management**: Intelligent workspace understanding with ChromaDB
- 🌐 **Modern Web UI**: Clean, responsive interface built with Streamlit

## Technologies

### Frontend
- Streamlit
- HTML/CSS
- JavaScript

### Backend
- Python 3.10+
- FastAPI
- Uvicorn

### AI/ML
- CrewAI
- AutoGen
- Ollama

### Database
- ChromaDB

### Development Environment
- Node.js 18+
- Git
- uv
- Python venv

## Getting Started

See [INSTALL.md](INSTALL.md) and [USAGE.md](USAGE.md) for setup and usage instructions.

## Project Structure

```
/server            → FastAPI backend and Streamlit UI
  /static         → Static assets
  app.py         → Streamlit web interface
  main.py        → FastAPI server
  flows.py       → CrewAI workflows
  context_manager.py → ChromaDB integration
/extension        → VSCode extension (optional)
/models           → Ollama model definitions
/scripts          → Development tools
```

## Contributing

We welcome contributions! Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project.

## Roadmap

- 📝 Chat history persistence
- 🔌 Custom agent plugins
- 🚀 Performance optimizations
- 📊 Enhanced analytics dashboard
- 🔄 Multi-user support
- 🔐 Authentication system

## Known Issues

- ⏳ Slow initial model loading
- 📈 Large project performance edge cases
- 🔄 Occasional context switching delays
- 🌐 Web UI may require refresh for model updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to:
- The CrewAI and AutoGen communities for their excellent frameworks
- The Ollama team for making local AI models accessible
- The ChromaDB team for their powerful vector database
- The Streamlit team for their amazing web framework
- All contributors and users who have helped shape this project

## Contact

- **Project Lead**: [JKP](https://github.com/JKP2599)
- **Email**: jatinkishorepatel@gmail.com
- **GitHub**: [https://github.com/JKP2599/CodeHermit](https://github.com/JKP2599/CodeHermit)

---

*Note: This project is actively maintained and regularly updated with new features and improvements.* 