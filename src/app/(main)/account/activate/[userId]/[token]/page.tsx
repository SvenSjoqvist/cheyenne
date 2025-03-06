// app/account/activate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { activateAccount, setCustomerAccessToken } from '@/app/lib/auth/auth';

export default function AccountActivationPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activationUrl = searchParams.get('activationUrl');

  // Validate the activation URL is present
  console.log('activationUrl', activationUrl);
  useEffect(() => {
    if (!activationUrl) {
      setError('Missing activation URL. Please check your email link.');
    }
  }, [activationUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (!activationUrl) {
      setError('Missing activation URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await activateAccount(activationUrl, password);
      
      if (result.success && result.accessToken) {
        // Use the server action to set the cookie
        await setCustomerAccessToken(result.accessToken, result.expiresAt);
        
        setIsSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/account');
          router.refresh(); // Refresh to update auth state
        }, 2000);
      } else {
        setError(result.error || 'Failed to activate account');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Activate Your Account</h1>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              Your account has been activated successfully!
            </div>
            <p className="mb-4">You are now logged in.</p>
            <p>Redirecting to your account page...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !activationUrl}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Activating...' : 'Activate Account'}
              </button>
            </form>
          </>
        )}
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}