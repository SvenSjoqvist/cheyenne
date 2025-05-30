"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/components/client/account/actions"; 

export default function SignInModal({ onClose, isVisible, setShowModal, setIsVisible }: { 
  onClose?: () => void, 
  isVisible: boolean, 
  setShowModal: Dispatch<SetStateAction<"login" | "signup" | "lostpassword" | null>>, 
  setIsVisible: (visible: boolean) => void 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  // Set visible after mount for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, [isVisible, setIsVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual unmounting to allow for animation
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await login(formData);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/account");
        router.refresh();
        handleClose();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 transition-opacity duration-300${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#212121] p-20 max-w-[500px] w-full relative shadow-xl transition-transform duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white transition-colors duration-200 cursor-pointer"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div
          className={`transition-opacity duration-300 text-white ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-center text-xl mb-6 text-white">
            Check your order status, create a return, and view and manage your
            account.
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="email"
                className="w-full p-3 border bg-white border-gray-300 rounded mb-3 transition-all placeholder:text-black text-black"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                className="w-full p-3 border bg-white border-gray-300 rounded transition-all placeholder:text-black text-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 border-b border-gray-300 font-medium mb-4 hover:underline transition-all duration-200 text-white"
            >
              {isLoading ? "signing in..." : "sign in"}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setShowModal("lostpassword")}
              className="text-sm text-white hover:underline mb-4 block mx-auto transition-colors duration-200"
            >
              forgot your password?
            </button>

            <button
              className="text-sm text-white hover:underline block mx-auto transition-colors duration-200"
              onClick={() => setShowModal("signup")}
            >
              create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}