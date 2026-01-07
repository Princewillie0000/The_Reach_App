'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMockSession } from '../../../../lib/mockAuth';
import { PropertyGallery } from '../../../../components/properties/PropertyGallery';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { Property, PropertyStatus } from '../../../../types/property';
import { propertyApi } from '../../../../lib/mockApi/propertyApi';
import { formatPrice } from '../../../../lib/formatters';
import { ArrowLeft, CheckCircle, XCircle, MapPin, Bed, Bath, FileText, Eye, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminReviewPage() {
  const router = useRouter();
  const params = useParams();
  const session = getMockSession();
  const propertyId = (params?.id as string) || '';
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      router.push('/admin/properties');
      return;
    }

    if (session.role !== 'ADMIN') {
      router.push('/properties');
      return;
    }

    loadProperty();
  }, [propertyId, session.role, router]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const prop = await propertyApi.getPropertyById(propertyId);
      if (!prop) {
        router.push('/admin/properties');
        return;
      }

      // Only show properties in queue
      if (prop.status !== PropertyStatus.SUBMITTED && prop.status !== PropertyStatus.PENDING_VERIFICATION) {
        router.push('/admin/properties');
        return;
      }

      setProperty(prop);
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!property) return;

    try {
      setIsProcessing(true);
      await propertyApi.adminApproveProperty(property.id);
      router.push('/admin/properties');
    } catch (error: any) {
      alert(error.message || 'Failed to approve property');
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!property || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setIsProcessing(true);
      await propertyApi.adminRejectProperty(property.id, rejectionReason);
      router.push('/admin/properties');
    } catch (error: any) {
      alert(error.message || 'Failed to reject property');
      setIsProcessing(false);
    }
  };

  if (session.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-reach-light p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-reach-light p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">Review Property</h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={property.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {property.media.length > 0 && (
          <PropertyGallery media={property.media} />
        )}

        {/* Property Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>

          {/* Location */}
          {property.locationText && (
            <div className="flex items-center gap-2 text-reach-red">
              <MapPin size={18} />
              <span className="text-sm font-medium">{property.locationText}</span>
            </div>
          )}

          {/* Price */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(property.askingPrice, property.currency)}
            </span>
          </div>

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

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          {!showRejectDialog ? (
            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={20} />
                Approve Property
              </button>
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle size={20} />
                Reject Property
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="Explain why this property is being rejected..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                  }}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <XCircle size={20} />
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

