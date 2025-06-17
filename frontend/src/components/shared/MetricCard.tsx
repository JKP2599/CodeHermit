import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const MetricCard = ({ title, value, unit, icon }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          p: 0.5,
        }}
      >
        <CardContent sx={{ p: '8px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            {icon && (
              <Box sx={{ mr: 0.5, color: 'primary.main', fontSize: '1rem' }}>
                {icon}
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
            {unit && (
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {unit}
              </Typography>
            )}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 