# CodeHermit Frontend

A modern React frontend for the CodeHermit local AI coding assistant.

## Features

- 🎨 Material UI v5 with Material 3 design principles
- ⚡ Fast development with Vite
- 📱 Responsive layout
- 🎭 Smooth animations with Framer Motion
- 💻 Code syntax highlighting
- 🔄 Real-time system metrics
- 🤖 AI-powered code generation and review
- 💬 Interactive chat interface

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── features/     # Feature-specific components
  │   ├── layout/       # Layout components
  │   └── shared/       # Shared/reusable components
  ├── services/         # API and other services
  ├── theme/           # MUI theme configuration
  ├── types/           # TypeScript type definitions
  └── utils/           # Utility functions
```

## Development

The frontend is built with:

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`. Make sure the backend is running before starting the frontend.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
