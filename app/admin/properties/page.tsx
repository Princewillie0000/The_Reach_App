'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMockSession } from '../../../lib/mockAuth';
import { PropertyTable } from '../../../components/properties/PropertyTable';
import { Property } from '../../../types/property';
import { propertyApi } from '../../../lib/mockApi/propertyApi';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const session = getMockSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session.role !== 'ADMIN') {
      router.push('/properties');
      return;
    }

    loadProperties();
  }, [session.role]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const queue = await propertyApi.listAdminQueue();
      setProperties(queue);
    } catch (error) {
      console.error('Failed to load admin queue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (session.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-reach-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reach-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="text-reach-navy" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">Admin Review Queue</h1>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 text-lg">No properties pending review</p>
          </div>
        ) : (
          <PropertyTable properties={properties} />
        )}
      </div>
    </div>
  );
}

