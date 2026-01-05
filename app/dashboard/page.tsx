'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { UserRole } from '../../types';
import DeveloperDashboard from '../../pages/dashboards/DeveloperDashboard';
import CreatorDashboard from '../../pages/dashboards/CreatorDashboard';
import BuyerDashboard from '../../pages/dashboards/BuyerDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-reach-light">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin mb-4"></div>
          <p className="text-reach-navy font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role === UserRole.DEVELOPER) {
    return <DeveloperDashboard user={user} />;
  }

  if (user.role === UserRole.CREATOR) {
    return <CreatorDashboard user={user} />;
  }

  return <BuyerDashboard user={user} />;
}

