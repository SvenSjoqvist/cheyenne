"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/components/client/account/actions";

export default function SignUpModal({ onClose, isVisible, setIsVisible }: { onClose?: () => void, isVisible: boolean, setIsVisible: (visible: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });
  const router = useRouter();

  // Password validation rules
  const validatePassword = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      feedback.push("Password must be at least 8 characters long");
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      feedback.push("Include at least one uppercase letter");
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      feedback.push("Include at least one lowercase letter");
    } else {
      score += 1;
    }

    // Number check
    if (!/\d/.test(password)) {
      feedback.push("Include at least one number");
    } else {
      score += 1;
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push("Include at least one special character");
    } else {
      score += 1;
    }

    return { score, feedback };
  };

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(validatePassword(password));
  };

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const confirmEmail = formData.get("confirmEmail") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate emails match
    if (email !== confirmEmail) {
      setError("Email addresses do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const { score, feedback } = validatePassword(password);
    if (score < 3) {
      setError(`Password too weak: ${feedback.join(", ")}`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
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
          className={`transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-center text-xl mb-6 text-white">
            create an account
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4 mb-4 placeholder:text-black text-white">
              <input
                type="name"
                name="firstName"
                autoComplete="given-name"
                placeholder="first name"
                className="p-3 border border-gray-300 rounded-lg transition-all bg-white placeholder:text-black text-black"
                required
              />
              <input
                type="name"
                name="lastName"
                autoComplete="family-name"
                placeholder="last name"
                className="p-3 border border-gray-300 rounded-lg transition-all bg-white placeholder:text-black text-black"
                required
              />
            </div>

            <div className="mb-4 placeholder:text-black text-white">
              <input
                type="email"
                name="email"
                placeholder="email"
                className="w-full p-3 border border-gray-300 rounded mb-3 bg-white placeholder:text-black text-black focus:border-transparent transition-all"
                required
              />
              <input
                type="email"
                name="confirmEmail"
                placeholder="confirm email"
                className="w-full p-3 border border-gray-300 rounded mb-3 bg-white placeholder:text-black text-black focus:border-transparent transition-all"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                className="w-full p-3 border border-gray-300 rounded mb-3 bg-white placeholder:text-black focus:border-transparent transition-all text-black"
                required
                onChange={handlePasswordChange}
              />
              {passwordStrength.feedback.length > 0 && (
                <div className="mb-3 text-sm">
                  <div className="text-white mb-1">Password requirements:</div>
                  <ul className="list-disc list-inside text-gray-300">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
              <input
                type="password"
                name="confirmPassword"
                placeholder="confirm password"
                className="w-full p-3 border border-gray-300 rounded mb-3 bg-white placeholder:text-black focus:border-transparent transition-all text-black"
                required
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptsMarketing"
                  className="mr-2"
                />
                <span className="text-sm text-white">
                  email me with news and offers.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl py-2 border-b border-gray-300 font-medium mb-4 hover:underline transition-all duration-200 text-white cursor-pointer"
            >
              {isLoading ? "creating account..." : "create your account"}
            </button>
          </form>

          <p className="text-xs text-center mb-4 text-white">
            By signing up for an account you accept our{" "}
            <a href="/tos" className="underline text-white cursor-pointer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline text-white cursor-pointer"
            >
              Privacy Policy
            </a>
            .
          </p>

          <div className="text-center text-white">
            <button
              onClick={handleClose}
              className="text-sm text-white hover:underline block mx-auto transition-colors duration-200 cursor-pointer"
            >
              track without an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
