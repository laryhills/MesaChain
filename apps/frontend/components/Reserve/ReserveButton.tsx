"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ReserveButton = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    if (isMounted) {
      router.push('/reserve');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isMounted}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      Reserve a Table
    </button>
  );
}; 