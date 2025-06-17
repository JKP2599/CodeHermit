import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { reviewCode } from '../../services/api';
import { ResizableBox } from '../shared/ResizableBox';

export const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const result = await reviewCode(code);
      const reviewText = result.issues?.[0] || result.response || '';
      setReview(reviewText);
    } catch (error) {
      console.error('Error reviewing code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6">
          Code Reviewer
        </Typography>
        <Button
          variant="contained"
          onClick={handleReview}
          disabled={loading || !code.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Review Code'}
        </Button>
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0, px: 2 }}>
        <ResizableBox
          initialHeight={200}
          minHeight={100}
          maxHeight={400}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TextField
              multiline
              fullWidth
              minRows={4}
              maxRows={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for review..."
              variant="outlined"
              sx={{ flex: 1 }}
            />
          </Paper>
        </ResizableBox>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: 'background.default'
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {review || 'Review results will appear here...'}
          </pre>
        </Paper>
      </Box>
    </Box>
  );
}; 