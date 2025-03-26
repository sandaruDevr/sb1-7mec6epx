import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../lib/firebase';
import { FileText, Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react';
import { useAuth } from './AuthContext';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  createdAt: number;
  lastLoginAt: number;
  summaryCount: number;
  plan: 'free' | 'pro';
  dailySummaryCount: number;
  dailySummaryResetTime: number;
}

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const createUserProfile = async (uid: string, userData: UserData) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user profile in the database
      const now = Date.now();
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0); // Set to next midnight

      const userData: UserData = {
        uid: userCredential.user.uid,
        displayName: name,
        email: userCredential.user.email!,
        createdAt: now,
        lastLoginAt: now,
        summaryCount: 0,
        plan: 'free',
        dailySummaryCount: 0,
        dailySummaryResetTime: resetTime.getTime()
      };

      await createUserProfile(userCredential.user.uid, userData);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'An error occurred during sign up';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      
      if (result?.user) {
        const now = Date.now();
        const resetTime = new Date();
        resetTime.setHours(24, 0, 0, 0); // Set to next midnight

        const userData: UserData = {
          uid: result.user.uid,
          displayName: result.user.displayName || 'User',
          email: result.user.email!,
          createdAt: now,
          lastLoginAt: now,
          summaryCount: 0,
          plan: 'free',
          dailySummaryCount: 0,
          dailySummaryResetTime: resetTime.getTime()
        };

        await createUserProfile(result.user.uid, userData);
      }
    } catch (err) {
      setError('Failed to sign up with Google');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[564px] h-[298px] bg-[#009EFF] blur-[55px] rounded-full transform rotate-[-15deg] opacity-30 -z-10" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-[#009EFF]" />
            <span className="logo-text text-3xl">Summary.gg</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Join thousands of learners using Summary.gg</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            className="w-full mb-6 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent transition-colors"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#00A3FF] text-white rounded-lg font-medium hover:bg-[#0096FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-sm text-gray-500">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-[#00A3FF] hover:text-[#0096FF] transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#00A3FF] hover:text-[#0096FF] transition-colors">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00A3FF] hover:text-[#0096FF] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;