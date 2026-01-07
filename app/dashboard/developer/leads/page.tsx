'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../contexts/UserContext';
import { getMockSession } from '../../../../lib/mockAuth';
import { DashboardShell } from '../../../../components/dashboard/DashboardShell';
import { Search, Filter, Users, ChevronRight, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  propertyTitle: string;
  propertyImage?: string;
  status: 'New' | 'Contacted' | 'Booked inspection' | 'Converted';
  timestamp: string;
  interestedCount: number;
  propertyId: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    propertyTitle: '4 Bedroom duplex Apartment',
    propertyImage: 'https://picsum.photos/400/300?random=1',
    status: 'New',
    timestamp: 'Yesterday, 1:05 PM',
    interestedCount: 2,
    propertyId: 'prop1'
  },
  {
    id: '2',
    propertyTitle: '4 Bedroom duplex Apartment',
    propertyImage: 'https://picsum.photos/400/300?random=2',
    status: 'Contacted',
    timestamp: '2 days ago, 3:20 PM',
    interestedCount: 3,
    propertyId: 'prop2'
  },
  {
    id: '3',
    propertyTitle: '4 Bedroom duplex Apartment',
    propertyImage: 'https://picsum.photos/400/300?random=3',
    status: 'Booked inspection',
    timestamp: '3 days ago, 10:15 AM',
    interestedCount: 1,
    propertyId: 'prop3'
  },
  {
    id: '4',
    propertyTitle: '4 Bedroom duplex Apartment',
    propertyImage: 'https://picsum.photos/400/300?random=4',
    status: 'Converted',
    timestamp: '1 week ago, 2:30 PM',
    interestedCount: 2,
    propertyId: 'prop4'
  },
];

const FILTER_TABS = [
  { label: 'All', count: null },
  { label: 'New', count: 150 },
  { label: 'Contacted', count: 150 },
  { label: 'Booked inspection', count: 5 },
];

export default function DeveloperLeadsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }

    setLoading(false);
  }, [user, userLoading, session.role, router]);

  useEffect(() => {
    // Filter leads based on active filter and search query
    let filtered = MOCK_LEADS;

    if (activeFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.propertyTitle.toLowerCase().includes(query) ||
        lead.status.toLowerCase().includes(query)
      );
    }

    setLeads(filtered);
  }, [activeFilter, searchQuery]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'text-green-600';
      case 'Contacted':
        return 'text-blue-600';
      case 'Booked inspection':
        return 'text-orange-600';
      case 'Converted':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDotColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-green-500';
      case 'Contacted':
        return 'bg-blue-500';
      case 'Booked inspection':
        return 'bg-orange-500';
      case 'Converted':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (userLoading || loading) {
    return (
      <DashboardShell user={user}>
        <div className="min-h-screen bg-[#FDFBFA] flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin"></div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user}>
      <div className="min-h-screen bg-[#FDFBFA]">
        <div className="max-w-7xl mx-auto p-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-2xl border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
                  ${activeFilter === tab.label
                    ? 'bg-[#FFE5D9] text-gray-900'
                    : 'bg-gray-100 text-gray-700'
                  }
                `}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 ${activeFilter === tab.label ? 'text-gray-900' : 'text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Leads List or Empty State */}
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gray-100 rounded-3xl p-12 mb-6 w-full max-w-xs">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="w-16 h-16 rounded-full bg-gray-200 absolute top-0 left-0 -translate-x-2"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-24 mx-auto mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-full w-32 mx-auto"></div>
              </div>
              <p className="text-gray-500 text-center">Your Leads will appear here....</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => router.push(`/dashboard/developer/leads/${lead.id}`)}
                  className="w-full bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  {/* Property Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0 overflow-hidden">
                    {lead.propertyImage ? (
                      <img src={lead.propertyImage} alt={lead.propertyTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(lead.status)}`} />
                      <span className={`text-xs font-semibold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {lead.propertyTitle}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{lead.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{lead.interestedCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
