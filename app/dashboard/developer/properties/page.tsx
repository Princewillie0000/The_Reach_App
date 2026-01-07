'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../contexts/UserContext';
import { getMockSession } from '../../../../lib/mockAuth';
import { DashboardShell } from '../../../../components/dashboard/DashboardShell';
import { PropertyTable } from '../../../../components/properties/PropertyTable';
import { PropertyStatus, Property } from '../../../../types/property';
import { propertyApi } from '../../../../lib/mockApi/propertyApi';
import { Plus, Search, FileEdit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DeveloperPropertiesPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    filterProperties();
  }, [properties, activeTab, searchQuery]);

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

  const filterProperties = () => {
    let filtered = [...properties];

    // Filter by status
    if (activeTab !== 'All') {
      filtered = filtered.filter(p => {
        if (activeTab === 'Verified') return p.status === PropertyStatus.VERIFIED;
        if (activeTab === 'Rejected') return p.status === PropertyStatus.REJECTED;
        if (activeTab === 'Pending') return p.status === PropertyStatus.PENDING_VERIFICATION || p.status === PropertyStatus.SUBMITTED;
        if (activeTab === 'Draft') return p.status === PropertyStatus.DRAFT;
        return true;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.locationText?.toLowerCase().includes(query) ||
        p.status.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  };

  if (userLoading || loading) {
    return (
      <DashboardShell user={user || undefined}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user || undefined}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/developer/properties/drafts')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <FileEdit size={18} />
              Drafts
            </button>
            <button
              onClick={() => router.push('/dashboard/developer/properties/new')}
              className="flex items-center gap-2 px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors"
            >
              <Plus size={20} />
              Add Property
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, status..."
            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-1 ring-reach-red/20"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Verified', 'Rejected', 'Pending', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-reach-navy text-white shadow-md'
                  : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Properties Table */}
        <PropertyTable properties={filteredProperties} />
      </div>
    </DashboardShell>
  );
}

