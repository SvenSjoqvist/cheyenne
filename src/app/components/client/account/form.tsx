"use client";

import { useState, useEffect } from "react";
import SignInModal from "@/app/components/client/account/ui/SignInModal";
import SignUpModal from "@/app/components/client/account/ui/SignUpModal";
import LostPasswordModal from "@/app/components/client/account/ui/LostPasswordModal";

export default function AuthModals({ onClose }: { onClose?: () => void }) {
  const [showModal, setShowModal] = useState<"login" | "signup" | "lostpassword" | null>("login");
  const [isVisible, setIsVisible] = useState(false);
  
  // Set visible after mount for animation
  console.log(showModal);
    
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual unmounting to allow for animation
    setTimeout(() => {
      setShowModal(null);
      if (onClose) onClose();
    }, 300);
  };

  // Render the modals
  if (!showModal) return null;

  return (
    <>
      {showModal === "login" ? (
        <SignInModal 
          onClose={handleClose} 
          isVisible={isVisible}
          setShowModal={setShowModal}
          setIsVisible={setIsVisible}
        />
      ) : showModal === "signup" ? (
        <SignUpModal 
          onClose={handleClose} 
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      ) : (
        <LostPasswordModal
          onClose={handleClose}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}
    </>
  );
}
