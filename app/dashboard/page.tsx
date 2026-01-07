'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { getMockSession } from '../../lib/mockAuth';
import { UserRole } from '../../types';
import DeveloperDashboard from '../../components/dashboards/DeveloperDashboard';
import CreatorDashboard from '../../components/dashboards/CreatorDashboard';
import BuyerDashboard from '../../components/dashboards/BuyerDashboard';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const session = getMockSession();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }

    // Redirect developers to new dashboard
    if (user && user.role === UserRole.DEVELOPER) {
      router.push('/dashboard/developer');
      return;
    }

    // Redirect admins to admin panel
    if (session.role === 'ADMIN') {
      router.push('/admin/properties');
      return;
    }
  }, [user, isLoading, router, session.role]);

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

  // Fallback to old dashboards for Creator/Buyer
  if (user.role === UserRole.CREATOR) {
    return <CreatorDashboard user={user} />;
  }

  return <BuyerDashboard user={user} />;
}

