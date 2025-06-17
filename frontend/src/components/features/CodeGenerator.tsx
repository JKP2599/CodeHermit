import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { generateCode } from '../../services/api';
import { ResizableBox } from '../shared/ResizableBox';

export const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateCode(prompt);
      setGeneratedCode(result.code || result.response || '');
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6">
          Code Generator
        </Typography>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Code'}
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code you want to generate..."
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
            {generatedCode || 'Generated code will appear here...'}
          </pre>
        </Paper>
      </Box>
    </Box>
  );
}; 