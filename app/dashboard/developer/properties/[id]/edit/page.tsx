'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '../../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../../lib/mockAuth';
import { DashboardShell } from '../../../../../../components/dashboard/DashboardShell';
import { propertyFormSchema, PropertyFormData } from '../../../../../../lib/validations/propertySchema';
import { MediaUploader } from '../../../../../../components/forms/MediaUploader';
import { DocumentUploader } from '../../../../../../components/forms/DocumentUploader';
import { VisibilitySelector } from '../../../../../../components/forms/VisibilitySelector';
import { PropertyMedia, PropertyDocument, ListingType, PropertyStatus } from '../../../../../../types/property';
import { propertyApi } from '../../../../../../lib/mockApi/propertyApi';
import { ArrowLeft, Save, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const propertyId = (params?.id as string) || '';
  const [property, setProperty] = useState<any>(null);
  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitAction, setSubmitAction] = useState<'draft' | 'verify' | null>(null);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: {
      listingType: ListingType.SALE,
      visibility: 'ALL_CREATORS' as any,
      currency: 'NGN',
      country: 'Nigeria',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const listingType = watch('listingType');
  const visibility = watch('visibility');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }

    loadProperty();
  }, [propertyId, user, userLoading, session.role]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const prop = await propertyApi.getPropertyById(propertyId);
      if (!prop) {
        router.push('/dashboard/developer/properties');
        return;
      }

      // Check if property can be edited
      if (prop.status !== PropertyStatus.DRAFT && prop.status !== PropertyStatus.REJECTED) {
        router.push(`/dashboard/developer/properties/${propertyId}`);
        return;
      }

      setProperty(prop);
      setMedia(prop.media || []);
      setDocuments(prop.documents || []);

      // Reset form with property data
      reset({
        title: prop.title,
        description: prop.description,
        listingType: prop.listingType,
        visibility: prop.visibility,
        askingPrice: prop.askingPrice,
        minAcceptablePrice: prop.minAcceptablePrice,
        currency: prop.currency || 'NGN',
        locationText: prop.locationText,
        city: prop.city,
        state: prop.state,
        country: prop.country || 'Nigeria',
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
      });
    } catch (error) {
      console.error('Failed to load property:', error);
      router.push('/dashboard/developer/properties');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PropertyFormData, action: 'draft' | 'verify') => {
    try {
      setIsSubmitting(true);

      if (action === 'verify') {
        // Validate required media
        const images = media.filter(m => m.type === 'IMAGE');
        if (images.length === 0) {
          alert('At least one image is required before submitting for verification');
          setIsSubmitting(false);
          return;
        }

        // Validate required documents
        const requiredDocs = getRequiredDocuments(listingType);
        const hasRequiredDocs = requiredDocs.every(docType =>
          documents.some(doc => doc.docType === docType)
        );

        if (!hasRequiredDocs) {
          alert(`Missing required documents for ${listingType} listing`);
          setIsSubmitting(false);
          return;
        }
      }

      await propertyApi.updateProperty(propertyId, {
        ...data,
        media,
        documents,
      });

      if (action === 'verify') {
        await propertyApi.submitPropertyForVerification(propertyId);
      }

      router.push(`/dashboard/developer/properties/${propertyId}`);
    } catch (error: any) {
      alert(error.message || 'Failed to update property');
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = handleSubmit(async (data: PropertyFormData) => {
    await onSubmit(data, 'draft');
  });

  const handleSubmitForVerification = handleSubmit(async (data: PropertyFormData) => {
    await onSubmit(data, 'verify');
  });

  const getRequiredDocuments = (type: ListingType): string[] => {
    switch (type) {
      case ListingType.SALE:
        return ['TITLE_DOC', 'SURVEY_PLAN', 'BUILDING_APPROVAL'];
      case ListingType.RENT:
        return ['PROOF_OF_OWNERSHIP'];
      case ListingType.LEAD_GEN:
        return [];
      default:
        return [];
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
    return null;
  }

  return (
    <DashboardShell user={user || undefined}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        </div>

        <form className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('listingType')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                >
                  <option value={ListingType.SALE}>Sale</option>
                  <option value={ListingType.RENT}>Rent</option>
                  <option value={ListingType.LEAD_GEN}>Lead Gen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  {...register('currency')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asking Price</label>
                <input
                  {...register('askingPrice', { valueAsNumber: true })}
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Acceptable Price</label>
                <input
                  {...register('minAcceptablePrice', { valueAsNumber: true })}
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
              <input
                {...register('locationText')}
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  {...register('city')}
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  {...register('state')}
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  {...register('country')}
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  {...register('bedrooms', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  {...register('bathrooms', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-reach-red focus:border-reach-red outline-none"
                />
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <VisibilitySelector
              value={visibility}
              onChange={(value) => setValue('visibility', value)}
            />
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
            <MediaUploader
              media={media}
              onChange={setMedia}
              maxImages={10}
              allowVideo={true}
            />
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
            <DocumentUploader
              documents={documents}
              onChange={setDocuments}
              listingType={listingType}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              Save Draft
            </button>
            {property.status === PropertyStatus.DRAFT && (
              <button
                type="button"
                onClick={handleSubmitForVerification}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
                Submit for Verification
              </button>
            )}
            {property.status === PropertyStatus.REJECTED && (
              <button
                type="button"
                onClick={handleSubmitForVerification}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-reach-navy text-white rounded-lg font-semibold hover:bg-reach-navy/90 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
                Resubmit for Verification
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

