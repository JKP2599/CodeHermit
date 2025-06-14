import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import { theme } from './theme/theme';
import { Sidebar } from './components/layout/Sidebar';
import { CodeGenerator } from './components/features/CodeGenerator';
import { CodeReviewer } from './components/features/CodeReviewer';
import { ChatInterface } from './components/features/ChatInterface';

const DRAWER_WIDTH = 320;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { sm: `${DRAWER_WIDTH}px` },
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="main navigation tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 0,
                  px: 3,
                },
              }}
            >
              <Tab label="Generate Code" />
              <Tab label="Review Code" />
              <Tab label="Chat" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CodeGenerator />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CodeReviewer />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ChatInterface />
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
