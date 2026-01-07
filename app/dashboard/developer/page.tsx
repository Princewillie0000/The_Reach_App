'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import { getMockSession } from '../../../lib/mockAuth';
import { DashboardShell } from '../../../components/dashboard/DashboardShell';
import StatCard from '../../../components/dashboard/StatCard';
import { PropertyStatus } from '../../../types/property';
import { propertyApi } from '../../../lib/mockApi/propertyApi';
import { Property } from '../../../types/property';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DeveloperDashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }

    loadProperties();
  }, [user, userLoading, session.role]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const devProperties = await propertyApi.listDeveloperProperties(session.userId);
      setProperties(devProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === PropertyStatus.VERIFIED).length,
    pending: properties.filter(p => 
      p.status === PropertyStatus.PENDING_VERIFICATION || 
      p.status === PropertyStatus.SUBMITTED
    ).length,
    rejected: properties.filter(p => p.status === PropertyStatus.REJECTED).length,
    draft: properties.filter(p => p.status === PropertyStatus.DRAFT).length,
    leads: 40 // Mock data
  };

  if (userLoading || loading) {
    return (
      <DashboardShell user={user || undefined}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user || undefined}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Listing" value={stats.total.toString()} change="+20%" />
          <StatCard label="Active Listing" value={stats.active.toString()} change="+20%" />
          <StatCard label="Pending Verif." value={stats.pending.toString()} change="+10%" />
          <StatCard label="Total Leads" value={stats.leads.toString()} change="+15%" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/dashboard/developer/properties/new')}
              className="px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors"
            >
              Add New Property
            </button>
            <button
              onClick={() => router.push('/dashboard/developer/properties')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View All Properties
            </button>
            <button
              onClick={() => router.push('/dashboard/developer/inspections/book')}
              className="flex items-center gap-2 px-6 py-3 bg-reach-red text-white rounded-lg font-semibold hover:bg-reach-red/90 transition-colors"
            >
              Book Inspection
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Recent Properties */}
        {properties.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
              <button
                onClick={() => router.push('/dashboard/developer/properties')}
                className="text-sm text-reach-red font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {properties.slice(0, 3).map((property) => (
                <div
                  key={property.id}
                  onClick={() => router.push(`/dashboard/developer/properties/${property.id}`)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    {property.media[0] && (
                      <img
                        src={property.media[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.locationText || 'No location'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {property.askingPrice ? `₦${property.askingPrice.toLocaleString()}` : 'Price on request'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{property.status.toLowerCase().replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

