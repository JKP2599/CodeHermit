import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { generateCode } from '../../services/api';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const STORAGE_KEY = 'code_generator_state';

interface GeneratorState {
  prompt: string;
  generatedCode: string;
}

export const CodeGenerator = () => {
  const [state, setState] = useState<GeneratorState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { prompt: '', generatedCode: '' };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleGenerate = async () => {
    if (!state.prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateCode(state.prompt);
      setState(prev => ({
        ...prev,
        generatedCode: result.code || result.response || ''
      }));
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Code Generator
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
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe the code you want to generate..."
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading || !state.prompt.trim()}
              sx={{ mt: 2, alignSelf: 'flex-end' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Code'}
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
            {state.generatedCode || 'Generated code will appear here...'}
          </pre>
        </Paper>
      </Box>
    </Box>
  );
}; 