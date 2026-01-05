'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import WalletPage from '../../pages/WalletPage';

export default function WalletPageRoute() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-reach-light">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin mb-4"></div>
          <p className="text-reach-navy font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return <WalletPage user={user} />;
}

