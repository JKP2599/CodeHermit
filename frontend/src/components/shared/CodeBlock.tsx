import { Box, Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code, language = 'python' }: CodeBlockProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
      </Paper>
    </motion.div>
  );
}; 