import { useState } from 'react';
import { GraduationCap, User, BookOpen, Users } from 'lucide-react';

function LoginDev({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication - in real app this would call Convex
      if (email && password) {
        const mockUser = {
          _id: 'mock-user-id',
          email,
          name: email.split('@')[0],
          role,
        };
        onLogin(mockUser);
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin', icon: Users, color: 'text-red-600' },
    { value: 'lecturer', label: 'Lecturer', icon: User, color: 'text-blue-600' },
    { value: 'student', label: 'Student', icon: BookOpen, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-2 sm:p-3 bg-primary-600 rounded-full">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Course Matching System
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Efficient course-lecturer-student management
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                        role === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mb-1 ${option.color}`} />
                      <span className="text-xs font-medium text-neutral-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Signing In...' : 'Sign In (Demo Mode)'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-500">
          <p>Academic Course Management System</p>
          <p className="mt-1 text-xs">Demo Mode - No Convex setup required</p>
        </div>
      </div>
    </div>
  );
}

export default LoginDev;
