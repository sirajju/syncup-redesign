
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration attempt:', formData);
      // Here you would typically handle actual registration
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join millions of users in secure messaging"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <input 
            type="checkbox" 
            id="terms"
            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg transition-all duration-200"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center pt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link 
            to="/login" 
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
