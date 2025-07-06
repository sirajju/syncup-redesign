
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log('Password reset requested for:', email);
      // Here you would typically handle actual password reset
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent a password reset link to your email"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600">
              We've sent a password reset link to:
            </p>
            <p className="font-medium text-gray-800">{email}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                try again
              </button>
            </p>
          </div>

          <Link 
            to="/login"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link"
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
            placeholder="Enter your email address"
            className="h-12 bg-white/50 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg transition-all duration-200"
        >
          {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </Button>

        <div className="text-center pt-4">
          <Link 
            to="/login"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
