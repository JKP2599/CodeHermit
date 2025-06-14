# Local Code Assistant VSCode Extension

## Overview
The Local Code Assistant VSCode extension provides AI-powered code generation, review, and chat capabilities directly within your VSCode environment. It leverages the FastAPI backend to interact with Ollama models for code generation and review.

## Features
- **Generate Code**: Get AI suggestions for selected code snippets.
- **Review Code**: Run multi-agent code reviews to identify issues and improvements.
- **Chat**: Start an interactive chat with the AI assistant for coding help.

## Installation
1. Open VSCode.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Local Code Assistant" and click on the Install button.

## Usage
1. **Generate Code**:
   - Select a code snippet in your editor.
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Type "Generate Code" and select the command.
   - The AI will generate code based on your selection.

2. **Review Code**:
   - Select the code you want to review.
   - Open the Command Palette.
   - Type "Review Code" and select the command.
   - The AI will review the code and provide feedback.

3. **Chat**:
   - Open the Command Palette.
   - Type "Chat" and select the command.
   - Type your message and press Enter to start a conversation with the AI.

## Configuration
- Ensure the FastAPI backend is running on `http://localhost:8000`.
- The extension uses the Ollama models available on your system. Use `ollama pull <model>` to add models if needed.

## Troubleshooting
- If the extension fails to connect to the backend, ensure the server is running and accessible.
- Check the VSCode output panel for any error messages related to the extension.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 