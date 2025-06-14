import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CodeBlock } from '../shared/CodeBlock';
import { generateCode } from '../../services/api';
import type { CodeGenerationResponse } from '../../services/api';

export const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateCode({ prompt });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Generate Code
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your code generation prompt..."
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Code'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Generated Code
          </Typography>
          <CodeBlock code={result.code} />

          {result.issues && result.issues.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Review Comments
              </Typography>
              {result.issues.map((issue, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {issue}
                </Alert>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}; 