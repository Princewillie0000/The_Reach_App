'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyGallery } from '../../../components/properties/PropertyGallery';
import { Property } from '../../../types/property';
import { propertyApi } from '../../../lib/mockApi/propertyApi';
import { formatPrice } from '../../../lib/formatters';
import { MapPin, Bed, Bath, Eye, Users, Star, ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PropertyDetailPublicPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = (params?.id as string) || '';
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) {
      router.push('/properties');
      return;
    }
    loadProperty();
  }, [propertyId, router]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const prop = await propertyApi.getPropertyById(propertyId);
      if (!prop) {
        router.push('/properties');
        return;
      }
      setProperty(prop);
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-reach-light p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-reach-light p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reach-light p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Properties</span>
        </button>

        {/* Gallery */}
        {property.media.length > 0 && (
          <PropertyGallery media={property.media} />
        )}

        {/* Property Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
          {/* Title and Rating */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              {property.locationText && (
                <div className="flex items-center gap-2 text-reach-red">
                  <MapPin size={18} />
                  <span className="text-sm font-medium">{property.locationText}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-reach-orange">
              <Star size={18} fill="currentColor" />
              <span className="font-bold">4.8(20)</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(property.askingPrice, property.currency)}
              </span>
              {property.minAcceptablePrice && property.minAcceptablePrice !== property.askingPrice && (
                <span className="text-sm text-gray-500">
                  (Min: {formatPrice(property.minAcceptablePrice, property.currency)})
                </span>
              )}
            </div>
          </div>

          {/* Property Features */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bed size={20} className="text-gray-400" />
                <span className="font-medium text-gray-700">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bath size={20} className="text-gray-400" />
                <span className="font-medium text-gray-700">{property.bathrooms} Bathroom</span>
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button className="flex-1 px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors">
              Request Inspection
            </button>
            <button className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Contact / Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

