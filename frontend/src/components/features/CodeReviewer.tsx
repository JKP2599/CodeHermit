import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { reviewCode } from '../../services/api';
import type { CodeReviewResponse } from '../../services/api';

export const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await reviewCode({ prompt: code });
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
        Review Code
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleReview}
        disabled={loading || !code.trim()}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Review Code'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Review Results
          </Typography>
          {result.issues && result.issues.length > 0 ? (
            result.issues.map((issue, index) => (
              <Alert key={index} severity="info" sx={{ mb: 1 }}>
                {issue}
              </Alert>
            ))
          ) : (
            <Alert severity="success">No issues found!</Alert>
          )}
        </Box>
      )}
    </Box>
  );
}; 