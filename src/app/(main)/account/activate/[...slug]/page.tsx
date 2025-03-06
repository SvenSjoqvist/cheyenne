// app/account/activate/[...slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerActivateByUrl } from '@/app/lib/shopify';

export default function ActivateAccount() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Activating your account...');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Get the full activation URL that was accessed
        const fullUrl = window.location.href;
        
        // Call the activation function
        const result = await customerActivateByUrl(fullUrl);
        
        if (result.success) {
          setStatus('success');
          setMessage('Your account has been successfully activated!');
          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push('/account/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to activate account. The link may be expired or invalid.');
        }
      } catch (error: unknown) {
        console.error('Activation error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An error occurred during activation. Please try again later.');
      }
    };

    activateAccount();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        
        {status === 'loading' && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <p>{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-green-600">
            <p>{message}</p>
            <p className="mt-2 text-sm">Redirecting to login page...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600">
            <p>{message}</p>
            <button 
              onClick={() => router.push('/account/login')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}