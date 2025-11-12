import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPageRefresh, setIsPageRefresh] = useState(false);

  useEffect(() => {
    // Check if this is a page refresh
    const isRefresh = performance.navigation?.type === 1 || 
                     performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    if (isRefresh) {
      setIsPageRefresh(true);
    }

    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      setIsPageRefresh(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    isInitialLoad,
    isPageRefresh,
    isLoading: isInitialLoad || isPageRefresh
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

