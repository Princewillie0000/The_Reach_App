'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../lib/mockAuth';
import { DashboardShell } from '../../../../../components/dashboard/DashboardShell';
import { inspectionApi } from '../../../../../lib/mockApi/inspectionApi';
import { Inspection, InspectionStatus } from '../../../../../types/inspection';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, User, Phone, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function InspectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const inspectionId = (params?.id as string) || '';

  useEffect(() => {
    if (!inspectionId) {
      router.push('/dashboard/developer/inspections');
      return;
    }

    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }

    loadInspection();
  }, [inspectionId, user, userLoading, session.role, router]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      const insp = await inspectionApi.getInspectionById(inspectionId);
      if (!insp) {
        router.push('/dashboard/developer/inspections');
        return;
      }
      setInspection(insp);
    } catch (error) {
      console.error('Failed to load inspection:', error);
      router.push('/dashboard/developer/inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!inspection) return;
    
    if (!confirm('Are you sure you want to cancel this inspection?')) {
      return;
    }

    try {
      await inspectionApi.cancelInspection(inspection.id);
      await loadInspection();
      alert('Inspection cancelled successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel inspection');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

  if (userLoading || loading) {
    return (
      <DashboardShell user={user || undefined}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!inspection) {
    return (
      <DashboardShell user={user || undefined}>
        <div className="p-6">
          <p className="text-gray-400">Inspection not found</p>
        </div>
      </DashboardShell>
    );
  }

  const canCancel = inspection.status === InspectionStatus.PENDING || 
                    inspection.status === InspectionStatus.SCHEDULED;

  return (
    <DashboardShell user={user || undefined}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inspection Details</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(inspection.status)}`}>
                  {inspection.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          {canCancel && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              <X size={18} />
              Cancel Inspection
            </button>
          )}
        </div>

        {/* Property Image */}
        {inspection.propertyImage && (
          <div className="w-full h-64 rounded-2xl overflow-hidden">
            <img
              src={inspection.propertyImage}
              alt={inspection.propertyTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Property Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">{inspection.propertyTitle}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{inspection.propertyLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Inspection Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="font-semibold text-gray-900">{formatDate(inspection.scheduledDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Time</p>
                <p className="font-semibold text-gray-900">{inspection.scheduledTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Inspection Type</p>
                <p className="font-semibold text-gray-900">{inspection.type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspector Information */}
        {inspection.inspectorName && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspector Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inspector Name</p>
                  <p className="font-semibold text-gray-900">{inspection.inspectorName}</p>
                </div>
              </div>
              {inspection.inspectorContact && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-900">{inspection.inspectorContact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {inspection.notes && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{inspection.notes}</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

