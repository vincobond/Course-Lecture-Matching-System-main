import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, User, RefreshCw } from 'lucide-react';

function UniversalLoader({ isVisible, onComplete, isPageRefresh = false }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = isPageRefresh ? [
    { icon: RefreshCw, text: 'Refreshing System...', color: 'text-blue-600' },
    { icon: BookOpen, text: 'Reloading Courses...', color: 'text-green-600' },
    { icon: GraduationCap, text: 'Updating Students...', color: 'text-purple-600' },
    { icon: User, text: 'Refreshing Lecturers...', color: 'text-primary-600' },
    { icon: BookOpen, text: 'Finalizing Dashboard...', color: 'text-primary-600' }
  ] : [
    { icon: BookOpen, text: 'Loading Courses...', color: 'text-blue-600' },
    { icon: GraduationCap, text: 'Loading Students...', color: 'text-green-600' },
    { icon: User, text: 'Loading Lecturers...', color: 'text-purple-600' },
    { icon: BookOpen, text: 'Setting up Dashboard...', color: 'text-primary-600' }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + (isPageRefresh ? 1.5 : 2);
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, isPageRefresh ? 600 : 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [isVisible, onComplete, isPageRefresh]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep]?.icon || BookOpen;

  return (
    <div className="universal-loader bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div>
        {/* Logo/Icon */}
        <div className="mb-6 sm:mb-8">
          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Course Matching System</h1>
          <p className="text-sm sm:text-base text-neutral-600">University Management Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4 loader-step">
            <CurrentIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${steps[currentStep]?.color || 'text-primary-600'} animate-pulse`} />
            <span className="text-base sm:text-lg font-medium text-neutral-700">
              {steps[currentStep]?.text || 'Loading...'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full loader-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Percentage */}
          <div className="mt-2 text-xs sm:text-sm text-neutral-600">
            {progress}%
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full animate-pulse ${
                i === currentStep % 3 ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-500">
          <p>Powered by Convex & React</p>
        </div>
      </div>
    </div>
  );
}

export default UniversalLoader;
