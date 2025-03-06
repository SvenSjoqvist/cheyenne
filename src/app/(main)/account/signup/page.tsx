// app/signup/page.tsx
import Link from 'next/link';
import SignupForm from '@/app/components/account/signup';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create Account - Your Store Name',
  description: 'Create a new account to start shopping',
};

export default async function SignupPage() {
  // Check if user is already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('customerAccessToken')?.value;
  if (token) {
    redirect('/account');
  }

  return (
    <div className="container mx-auto py-12">
      <SignupForm />
      
      <div className="max-w-md mx-auto mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
            Log in
          </Link>
        </p>
        
        <Link href="/" className="block mt-4 text-indigo-600 hover:text-indigo-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}