
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', { email, password });
      // Here you would typically handle actual authentication
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue to your conversations"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg transition-all duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center pt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link 
            to="/register" 
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
