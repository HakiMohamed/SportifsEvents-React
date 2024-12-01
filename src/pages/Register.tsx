// src/pages/Register.tsx

import React, { useState  } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '../validation/authSchema';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError 
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setBackendError(null);
    try {
      await signup(data.username, data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'An unexpected error occurred';
      setBackendError(errorMessage);
      setError('root', { 
        type: 'manual', 
        message: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Sign up to get started</p>
            </div>

            {backendError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{backendError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input 
                  id="username"
                  {...register('username')}
                  type="text" 
                  placeholder="Choose a username" 
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  id="email"
                  {...register('email')}
                  type="email" 
                  placeholder="Enter your email" 
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  id="password"
                  {...register('password')}
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a strong password" 
                  className={`w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2
                    ${errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input 
                  id="terms" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="terms" 
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{' '}
                  <a 
                    href="/terms" 
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent 
                  rounded-lg shadow-sm text-sm font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 
                  transition-colors duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" />
                    Sign Up
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 text-center text-xs text-gray-500">
            &copy; 2024 Your Company. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;