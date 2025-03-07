'use client';

import { useState, useEffect } from 'react';
import AuthModals from "./form";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { getCookies } from './actions';
export default function OpenForm() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  
  const handleOpenModal = async () => {
    const hasCookie = await getCookies({ cookieName: 'customerAccessToken' });
    if (hasCookie) {
      router.push('/account');
    }
    else {
      setShowModal(true);
    }
  };
  
  return (
    <div>
      <button onClick={handleOpenModal}>
        <Image 
          src="/icons/human.svg" 
          alt="Cart" 
          width={23} 
          height={23} 
          className='cursor-pointer'
        />
      </button>
      
      {showModal && <AuthModals onClose={() => setShowModal(false)} />}
    </div>
  );
}