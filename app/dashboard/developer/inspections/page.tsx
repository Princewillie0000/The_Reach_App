'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../contexts/UserContext';
import { getMockSession } from '../../../../lib/mockAuth';
import { DashboardShell } from '../../../../components/dashboard/DashboardShell';
import { inspectionApi } from '../../../../lib/mockApi/inspectionApi';
import { Inspection, InspectionStatus, InspectionType } from '../../../../types/inspection';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { Plus, Calendar, Clock, MapPin, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function InspectionsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
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

    loadInspections();
  }, [user, userLoading, session.role]);

  useEffect(() => {
    filterInspections();
  }, [inspections, activeTab]);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const allInspections = await inspectionApi.listInspections(session.userId);
      setInspections(allInspections);
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInspections = () => {
    let filtered = [...inspections];

    if (activeTab !== 'All') {
      filtered = filtered.filter(i => {
        if (activeTab === 'Scheduled') return i.status === InspectionStatus.SCHEDULED;
        if (activeTab === 'Pending') return i.status === InspectionStatus.PENDING;
        if (activeTab === 'Completed') return i.status === InspectionStatus.COMPLETED;
        if (activeTab === 'Cancelled') return i.status === InspectionStatus.CANCELLED;
        return true;
      });
    }

    setFilteredInspections(filtered);
  };

  const getStatusBadgeColor = (status: InspectionStatus) => {
    switch (status) {
      case InspectionStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-700';
      case InspectionStatus.PENDING:
        return 'bg-orange-100 text-orange-700';
      case InspectionStatus.COMPLETED:
        return 'bg-green-100 text-green-700';
      case InspectionStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
          <button
            onClick={() => router.push('/dashboard/developer/inspections/book')}
            className="flex items-center gap-2 px-6 py-3 bg-reach-red text-white rounded-lg font-semibold hover:bg-reach-red/90 transition-colors"
          >
            <Plus size={20} />
            Book Inspection
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Scheduled', 'Pending', 'Completed', 'Cancelled'].map((tab) => (
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

        {/* Inspections List */}
        {filteredInspections.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inspections Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {activeTab === 'All' 
                ? "You haven't booked any inspections yet."
                : `No ${activeTab.toLowerCase()} inspections found.`
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/developer/inspections/book')}
              className="px-6 py-3 bg-reach-red text-white rounded-lg font-semibold hover:bg-reach-red/90 transition-colors"
            >
              Book Your First Inspection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/developer/inspections/${inspection.id}`)}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Property Image */}
                  {inspection.propertyImage && (
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={inspection.propertyImage}
                        alt={inspection.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inspection.propertyTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{inspection.propertyLocation}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(inspection.status)}`}>
                        {inspection.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDate(inspection.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>{inspection.scheduledTime}</span>
                      </div>
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {inspection.type.replace('_', ' ')}
                      </div>
                    </div>

                    {inspection.inspectorName && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Inspector:</span> {inspection.inspectorName}
                        {inspection.inspectorContact && ` • ${inspection.inspectorContact}`}
                      </div>
                    )}

                    {inspection.notes && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FileText size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{inspection.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

