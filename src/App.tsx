import { CustomThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes';

function App() {
  return (
    <CustomThemeProvider>
      <AppRoutes />
    </CustomThemeProvider>
  );
}

export default App;
