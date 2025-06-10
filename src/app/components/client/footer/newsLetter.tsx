"use client";
import { addSubscriber } from "@/app/lib/prisma";
import Image from "next/image";
import { useState } from "react";

export const NewsLetter = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    try {
      setStatus('loading');
      setMessage('');
      
      const email = formData.get('email') as string;
      
      if (!email) {
        throw new Error('Email is required');
      }

      const result = await addSubscriber(email);
      setStatus('success');
      setMessage(result.message);
      
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Newsletter subscription error:', error);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col w-full max-w-md mx-auto leading-none text-neutral-800 mt-2">
      <p className="text-sm sm:text-sm tracking-wider leading-4 font-darker-grotesque">
        Receive early access and behind-the-scenes looks at our latest
        collections.
      </p>
      <div className="flex items-center mt-2 mb-1 w-full text-base tracking-wider text-stone-500">
        <input
          type="email"
          name="email"
          className="flex-grow px-3 py-2.5 border border-solid border-neutral-800 focus:outline-none"
          placeholder="enter email"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="cursor-pointer flex items-center justify-center w-[2.83rem] h-[2.83rem] bg-[#212121] transition-colors overflow-hidden disabled:opacity-50"
          disabled={status === 'loading'}
        >
          <Image
            src="/icons/arrow.svg"
            width={40}
            height={40}
            alt="Subscribe"
            className="transition-transform"
          />
        </button>
      </div>
      {status === 'success' && (
        <p className="mt-2 text-sm text-green-600">{message}</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </form>
  );
};
