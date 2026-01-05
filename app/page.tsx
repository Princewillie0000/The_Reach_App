'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import Landing from '../pages/Landing';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-reach-light">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin mb-4"></div>
          <p className="text-reach-navy font-semibold">The Reach App</p>
        </div>
      </div>
    );
  }

  return <Landing />;
}

