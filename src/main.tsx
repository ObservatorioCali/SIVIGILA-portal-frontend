import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import theme from './theme.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'

// Configuración de eventos pasivos para mejorar performance
// Esto resuelve los warnings de "non-passive event listener"
(function() {
  const addEventListenerOriginal = EventTarget.prototype.addEventListener;
  const removeEventListenerOriginal = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
    if (passiveEvents.includes(type) && typeof options !== 'object') {
      options = { passive: true, capture: false };
    } else if (typeof options === 'object' && options.passive === undefined && passiveEvents.includes(type)) {
      options.passive = true;
    }
    return addEventListenerOriginal.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    return removeEventListenerOriginal.call(this, type, listener, options);
  };
})();

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>,
)