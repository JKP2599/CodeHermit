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
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {icon && (
              <Box sx={{ mr: 1, color: 'primary.main' }}>
                {icon}
              </Box>
            )}
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
            {unit && (
              <Typography
                component="span"
                variant="subtitle1"
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