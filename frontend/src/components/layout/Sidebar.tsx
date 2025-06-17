import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Memory, Speed, Storage, Refresh, ExitToApp } from '@mui/icons-material';
import { MetricCard } from '../shared/MetricCard';
import { getMetrics, getAvailableModels, resetApp } from '../../services/api';
import type { SystemMetrics } from '../../services/api';

const DRAWER_WIDTH = 320;

export const Sidebar = () => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>('gpu');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await getAvailableModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          setSelectedModel(availableModels[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
        if (!data?.gpu_metrics && selectedDevice === 'gpu') {
          setSelectedDevice('cpu');
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  const handleRestart = async () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    setResetting(true);
    try {
      await resetApp();
      // Clear all component states
      setModels([]);
      setSelectedModel('');
      setMetrics(null);
      setSelectedDevice('gpu');
      // Clear all localStorage
      localStorage.clear();
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error resetting app:', error);
    } finally {
      setResetting(false);
      setResetDialogOpen(false);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              letterSpacing: 2,
              fontFamily: 'Impact, Montserrat, Inter, sans-serif',
              textAlign: 'center',
              fontSize: '2rem',
              color: 'primary.main',
              textShadow: '0 2px 8px rgba(255,111,97,0.15)'
            }}
          >
            CodeHermit
          </Typography>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Model</InputLabel>
            <Select
              value={selectedModel}
              label="Select Model"
              onChange={(e) => setSelectedModel(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              {models.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Device</InputLabel>
            <Select
              value={selectedDevice}
              label="Select Device"
              onChange={(e) => setSelectedDevice(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="gpu">GPU</MenuItem>
              <MenuItem value="cpu">CPU</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            System Metrics
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={1}>
              <MetricCard
                title="CPU Usage"
                value={metrics?.cpu_percent || 0}
                unit="%"
                icon={<Speed />}
              />
              <MetricCard
                title="Memory Usage"
                value={metrics?.memory_percent || 0}
                unit="%"
                icon={<Memory />}
              />
              {metrics?.gpu_metrics && selectedDevice === 'gpu' && (
                <>
                  <MetricCard
                    title="GPU Usage"
                    value={metrics.gpu_metrics.utilization}
                    unit="%"
                    icon={<Speed />}
                  />
                  <MetricCard
                    title="GPU Memory"
                    value={`${metrics.gpu_metrics.memory_used}MB`}
                    unit={`/ ${metrics.gpu_metrics.memory_total}MB`}
                    icon={<Storage />}
                  />
                </>
              )}
            </Stack>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.08)' }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={handleRestart}
              disabled={resetting}
              sx={{
                borderRadius: 3,
                minWidth: 120,
                height: 48,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0px 4px 16px rgba(255,111,97,0.15)',
                px: 3,
              }}
            >
              {resetting ? <CircularProgress size={24} /> : 'Reset'}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToApp />}
              onClick={() => window.close()}
              sx={{
                borderRadius: 3,
                minWidth: 120,
                height: 48,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0px 4px 16px rgba(255,82,82,0.15)',
                px: 3,
              }}
            >
              Exit
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <Dialog
        open={resetDialogOpen}
        onClose={() => !resetting && setResetDialogOpen(false)}
      >
        <DialogTitle>Reset Application</DialogTitle>
        <DialogContent>
          <Typography>
            This will clear all inputs, outputs, and reset the model. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} disabled={resetting}>
            Cancel
          </Button>
          <Button
            onClick={handleResetConfirm}
            color="primary"
            variant="contained"
            disabled={resetting}
          >
            {resetting ? <CircularProgress size={24} /> : 'Reset'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 