import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/api.js';
import { GraduationCap, User, BookOpen, Users } from 'lucide-react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const createUser = useMutation(api.auth.createUser);
  const authenticateUser = useMutation(api.auth.authenticateUser);

  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 3) {
      setPasswordError('Password must be at least 3 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Authenticate user against database
      const userData = await authenticateUser({ 
        email, 
        password,
        role 
      });
      
      if (!userData) {
        setError('User not found. Please contact your administrator for account access.');
        return;
      }

      onLogin(userData);
    } catch (err) {
      // Log technical details for debugging (development only)
      console.error('Login error:', err);
      
      // Filter out technical Convex errors and show user-friendly messages
      const errorMessage = err.message || err.toString();
      
      // Hide technical Convex error details
      if (errorMessage.includes('[CONVEX') || 
          errorMessage.includes('Request ID') || 
          errorMessage.includes('Server Error') ||
          errorMessage.includes('Called by client')) {
        setError('❌ Connection error. Please check your internet connection and try again.');
        return;
      }
      
      // Handle specific error types with user-friendly messages
      if (errorMessage.includes('User not found')) {
        setError('❌ Account not found. Please check your email address or contact your administrator.');
      } else if (errorMessage.includes('Invalid password')) {
        setError('❌ Incorrect password. Please check your password and try again.');
      } else if (errorMessage.includes('Invalid role')) {
        setError('❌ Wrong account type selected. Please select the correct role (Admin, Lecturer, or Student).');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        setError('❌ Connection error. Please check your internet connection and try again.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        setError('❌ Request timed out. Please try again.');
      } else {
        // For any other errors, show a generic user-friendly message
        setError('❌ Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // No self-registration allowed for any role
    setError('Account creation is restricted. All accounts must be created by the system administrator.');
    return;
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Course Matching System
          </h1>
          <p className="text-neutral-600">
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={`input-field ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email"
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                className={`input-field ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your password"
                required
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        role === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mx-auto mb-1 ${option.color}`} />
                      <span className="text-xs font-medium text-neutral-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Login Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              
              {/* Registration section - restricted for all roles */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Need Account Access?</p>
                    <p className="mt-1 text-blue-700">
                      All accounts are created by the system administrator. 
                      Contact your administrator for login credentials.
                    </p>
                    <p className="mt-2 text-xs text-blue-600">
                      <strong>Default Test Accounts:</strong><br/>
                      Admin: admin@gmail.com / admin123<br/>
                      Lecturer: lecturer@gmail.com / lecturer123<br/>
                      Student: student@gmail.com / student123
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-500">
          <p>Academic Course Management System</p>
        </div>
      </div>
    </div>
  );
}

export default Login;

