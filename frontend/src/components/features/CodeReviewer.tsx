import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { reviewCode } from '../../services/api';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Code Reviewer
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
        <ResizableBox
          width={Infinity}
          height={200}
          minConstraints={[Infinity, 100]}
          maxConstraints={[Infinity, 400]}
          axis="y"
          resizeHandles={['s']}
          style={{ marginBottom: '16px' }}
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
            <Button
              variant="contained"
              onClick={handleReview}
              disabled={loading || !code.trim()}
              sx={{ mt: 2, alignSelf: 'flex-end' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Review Code'}
            </Button>
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