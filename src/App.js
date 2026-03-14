import { memo, Suspense, lazy } from 'react';
import { AppBar, Toolbar, createTheme, ThemeProvider, Typography, CssBaseline, CircularProgress } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import SprintResults from './SprintStandings';

const DriverStandings = lazy(() => import('./DriverStandings'));
const RaceResults = lazy(() => import('./RaceResults'));
const ConstructorStandings = lazy(() => import('./ConstructorStandings'));

const darkTheme = createTheme({
  palette: {
    text: {
      primary: 'lightgray',
    },
    type: 'dark',
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#666',
    },
    background: {
      default: '#440444',
      paper: 'darkslategray',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          color: 'lightgray',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

const App = memo(function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ padding: 30 }}>
        <AppBar position="static" sx={{ borderTopLeftRadius: 6, borderTopRightRadius: 6}}>
          <Toolbar>
            <Typography variant="h4" sx={{ color: darkTheme.palette.text.primary, textAlign: 'center', flexGrow: 1 }}>Formula 1 Standings and Results</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'darkslategray' }}>
          <ErrorBoundary>
            <Suspense fallback={<CircularProgress sx={{ margin: 'auto', padding: 2 }} />}>
              <RaceResults />
              <SprintResults />
              <DriverStandings />
              <ConstructorStandings />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </ThemeProvider>
  );
});

export default App;
