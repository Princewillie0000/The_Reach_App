'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyFiltersWrapper } from '../../components/properties/PropertyFiltersWrapper';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { Property, PropertyFilters as PropertyFiltersType } from '../../types/property';
import { propertyApi } from '../../lib/mockApi/propertyApi';

export const dynamic = 'force-dynamic';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [searchParams]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const filters: PropertyFiltersType = {
        q: searchParams.get('q') || undefined,
        listingType: searchParams.get('listingType') as any,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
        city: searchParams.get('city') || undefined,
        state: searchParams.get('state') || undefined,
      };

      const verifiedProperties = await propertyApi.listVerifiedProperties(filters);
      setProperties(verifiedProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-reach-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reach-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>

        <PropertyFiltersWrapper />

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">No properties found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

