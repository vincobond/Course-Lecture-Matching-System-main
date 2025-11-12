import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-neutral-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;


