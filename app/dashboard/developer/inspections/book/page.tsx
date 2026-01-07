'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../lib/mockAuth';
import { DashboardShell } from '../../../../../components/dashboard/DashboardShell';
import { propertyApi } from '../../../../../lib/mockApi/propertyApi';
import { inspectionApi } from '../../../../../lib/mockApi/inspectionApi';
import { Property } from '../../../../../types/property';
import { InspectionType } from '../../../../../types/inspection';
import { ArrowLeft, Calendar, Clock, FileText, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function BookInspectionPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [inspectionType, setInspectionType] = useState<InspectionType>(InspectionType.INITIAL);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      // Only show verified properties for inspection booking
      const verifiedProperties = devProperties.filter(
        p => p.status === 'VERIFIED'
      );
      setProperties(verifiedProperties);
      if (verifiedProperties.length > 0) {
        setSelectedPropertyId(verifiedProperties[0].id);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPropertyId || !scheduledDate || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await inspectionApi.bookInspection({
        propertyId: selectedPropertyId,
        type: inspectionType,
        scheduledDate,
        scheduledTime,
        notes: notes || undefined,
      });
      
      // Redirect to handover flow after booking inspection
      router.push('/dashboard/developer/handover');
    } catch (error: any) {
      alert(error.message || 'Failed to book inspection');
    } finally {
      setSubmitting(false);
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

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <DashboardShell user={user || undefined}>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Inspection</h1>
            <p className="text-sm text-gray-500 mt-1">Schedule a property inspection</p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Verified Properties</h3>
            <p className="text-sm text-gray-500 mb-6">
              You need at least one verified property to book an inspection.
            </p>
            <button
              onClick={() => router.push('/dashboard/developer/properties')}
              className="px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors"
            >
              View Properties
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Selection */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Property *
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-reach-red/20 focus:border-reach-red outline-none"
                required
              >
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.locationText}
                  </option>
                ))}
              </select>
              {selectedProperty && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-4">
                    {selectedProperty.media[0] && (
                      <img
                        src={selectedProperty.media[0].url}
                        alt={selectedProperty.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selectedProperty.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{selectedProperty.locationText}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inspection Type */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Inspection Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(InspectionType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInspectionType(type)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      inspectionType === type
                        ? 'border-reach-red bg-reach-red/10 text-reach-red'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Calendar className="inline mr-2" size={16} />
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-reach-red/20 focus:border-reach-red outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Clock className="inline mr-2" size={16} />
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-reach-red/20 focus:border-reach-red outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <FileText className="inline mr-2" size={16} />
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add any special instructions or notes for the inspection..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-reach-red/20 focus:border-reach-red outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-reach-red text-white rounded-lg font-semibold hover:bg-reach-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Book Inspection'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}

