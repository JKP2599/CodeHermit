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
} from '@mui/material';
import { Memory, Speed, Storage } from '@mui/icons-material';
import { MetricCard } from '../shared/MetricCard';
import { getMetrics, getAvailableModels } from '../../services/api';
import type { SystemMetrics } from '../../services/api';

const DRAWER_WIDTH = 320;

export const Sidebar = () => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.default',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🤖 Local Code Assistant
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Model</InputLabel>
          <Select
            value={selectedModel}
            label="Select Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          System Metrics
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
            {metrics?.gpu_metrics && (
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
          </Box>
        )}
      </Box>
    </Drawer>
  );
}; 