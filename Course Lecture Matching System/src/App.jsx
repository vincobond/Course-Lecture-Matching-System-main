import { BrowserRouter as Router } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import UniversalLoader from './components/ui/UniversalLoader';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import './index.css';

// const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convex = new ConvexReactClient('https://graceful-mouse-263.convex.cloud');
// https://graceful-mouse-263.convex.cloud
function AppContent() {
  const { isLoading, isPageRefresh } = useLoading();
  const [showLoader, setShowLoader] = useState(true);

  // Add/remove body class for loader
  useEffect(() => {
    if (showLoader && isLoading) {
      document.body.classList.add('loader-active');
    } else {
      document.body.classList.remove('loader-active');
    }

    return () => {
      document.body.classList.remove('loader-active');
    };
  }, [showLoader, isLoading]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {showLoader && (
        <UniversalLoader 
          isVisible={isLoading} 
          onComplete={handleLoaderComplete}
          isPageRefresh={isPageRefresh}
        />
      )}
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <LoadingProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </LoadingProvider>
    </ConvexProvider>
  );
}

export default App;
