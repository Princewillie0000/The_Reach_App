'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../lib/mockAuth';
import { DashboardShell } from '../../../../../components/dashboard/DashboardShell';
import { PropertyGallery } from '../../../../../components/properties/PropertyGallery';
import { StatusBadge } from '../../../../../components/ui/StatusBadge';
import { Property, PropertyStatus } from '../../../../../types/property';
import { propertyApi } from '../../../../../lib/mockApi/propertyApi';
import { formatPrice } from '../../../../../lib/formatters';
import { ArrowLeft, Edit, Eye, Users, MapPin, Bed, Bath, Square, FileText, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const propertyId = (params?.id as string) || '';

  useEffect(() => {
    if (!propertyId) {
      router.push('/dashboard/developer/properties');
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

    loadProperty();
  }, [propertyId, user, userLoading, session.role, router]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const prop = await propertyApi.getPropertyById(propertyId);
      if (!prop) {
        router.push('/dashboard/developer/properties');
        return;
      }
      setProperty(prop);
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/dashboard/developer/properties');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = property && (
    property.status === PropertyStatus.DRAFT || 
    property.status === PropertyStatus.REJECTED
  );

  const canSubmit = property && property.status === PropertyStatus.DRAFT;

  const handleSubmitForVerification = async () => {
    if (!property) return;
    
    try {
      await propertyApi.submitPropertyForVerification(property.id);
      await loadProperty();
      alert('Property submitted for verification successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to submit property');
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

  if (!property) {
    return (
      <DashboardShell user={user || undefined}>
        <div className="p-6">
          <p className="text-gray-400">Property not found</p>
        </div>
      </DashboardShell>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={property.status} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => router.push(`/dashboard/developer/properties/${property.id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <Edit size={18} />
                Edit
              </button>
            )}
            {canSubmit && (
              <button
                onClick={handleSubmitForVerification}
                className="flex items-center gap-2 px-4 py-2 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors"
              >
                Submit for Verification
              </button>
            )}
          </div>
        </div>

        {/* Rejection Message */}
        {property.status === PropertyStatus.REJECTED && property.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Property Rejected</h3>
                <p className="text-sm text-red-700">{property.rejectionReason}</p>
                <button
                  onClick={() => router.push(`/dashboard/developer/properties/${property.id}/edit`)}
                  className="mt-3 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Review & Resubmit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Verification Message */}
        {property.status === PropertyStatus.PENDING_VERIFICATION && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">Pending Verification</h3>
                <p className="text-sm text-orange-700">
                  This property is undergoing verification. You'll be notified once the status changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gallery */}
        {property.media.length > 0 && (
          <PropertyGallery media={property.media} />
        )}

        {/* Property Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(property.askingPrice, property.currency)}
              </span>
              {property.minAcceptablePrice && property.minAcceptablePrice !== property.askingPrice && (
                <span className="text-sm text-gray-500">
                  (Min: {formatPrice(property.minAcceptablePrice, property.currency)})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-reach-orange">
              <span className="text-sm font-bold">4.8(20)</span>
            </div>
          </div>

          {/* Location */}
          {property.locationText && (
            <div className="flex items-center gap-2 text-reach-red">
              <MapPin size={18} />
              <span className="text-sm font-medium">{property.locationText}</span>
            </div>
          )}

          {/* Property Features */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bed size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bath size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{property.bathrooms} Bathroom</span>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Performance Stats */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Performance Stats</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">156 views</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">10 leads</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          {property.documents.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
              <div className="space-y-2">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                    <span className="ml-auto text-xs text-gray-500 capitalize">{doc.docType.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

