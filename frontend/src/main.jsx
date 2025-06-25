import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './components/backend/context/Auth.jsx';
import './i18n';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Suspense fallback={<div>Loading translations...</div>}>
                <App />
            </Suspense>
        </AuthProvider>
    </StrictMode>,
)
