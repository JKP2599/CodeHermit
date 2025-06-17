import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Types
export interface SystemMetrics {
  cpu_percent: number;
  memory_percent: number;
  gpu_metrics?: {
    utilization: number;
    memory_used: number;
    memory_total: number;
  };
}

export interface CodeGenerationRequest {
  prompt: string;
  model?: string;
  device?: string;
}

export interface CodeGenerationResponse {
  code?: string;
  response?: string;
  issues?: string[];
  status?: string;
}

export interface CodeReviewRequest {
  prompt: string;
  model?: string;
}

export interface CodeReviewResponse {
  code: string;
  issues: string[];
  status: string;
}

export interface ChatRequest {
  message: string;
  model?: string;
}

export interface ChatResponse {
  response: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API Client
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions
export const getMetrics = async (): Promise<SystemMetrics> => {
  const response = await api.get<SystemMetrics>('/metrics');
  return response.data;
};

export const getAvailableModels = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/models');
  return response.data;
};

export const restartModel = async (): Promise<void> => {
  await api.post('/restart');
};

export const quitApp = async (): Promise<void> => {
  await api.post('/quit');
};

export const generateCode = async (prompt: string): Promise<CodeGenerationResponse> => {
  const response = await api.post<CodeGenerationResponse>('/generate', { prompt });
  return response.data;
};

export const reviewCode = async (code: string): Promise<CodeGenerationResponse> => {
  const response = await api.post<CodeGenerationResponse>('/review', { prompt: code });
  return response.data;
};

export const sendMessage = async (message: string): Promise<CodeGenerationResponse> => {
  const response = await api.post<CodeGenerationResponse>('/chat', { message });
  return response.data;
};

export const resetApp = async (): Promise<void> => {
  await api.post('/reset');
  // Clear all local storage
  localStorage.clear();
}; 