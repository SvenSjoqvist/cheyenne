"use client";

import { useState } from "react";
import AuthModals from "./form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookies } from "./actions";
export default function OpenForm() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleOpenModal = async () => {
    const hasCookie = await getCookies({ cookieName: "customerAccessToken" });
    if (hasCookie) {
      router.push("/account");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleOpenModal} className="px-1">
        <Image
          src="/icons/human.svg"
          alt="Account"
          width={24}
          height={24}
          className="w-6 h-6 cursor-pointer"
        />
      </button>

      {showModal && <AuthModals onClose={() => setShowModal(false)} />}
    </div>
  );
}
