import { Property, PropertyStatus, PropertyFilters, ListingType, DocType } from '../../types/property';
import { usePropertyStore } from '../../stores/propertyStore';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get store state
const getStore = () => usePropertyStore.getState();

export const propertyApi = {
  // List all properties for a developer
  async listDeveloperProperties(developerId: string): Promise<Property[]> {
    await delay(200 + Math.random() * 200);
    return getStore().getPropertiesByDeveloper(developerId);
  },

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    await delay(150 + Math.random() * 150);
    const property = getStore().getPropertyById(id);
    return property || null;
  },

  // Create a new property draft
  async createPropertyDraft(payload: Partial<Property> & { developerId: string }): Promise<Property> {
    await delay(300 + Math.random() * 200);
    
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      developerId: payload.developerId,
      title: payload.title || 'Untitled Property',
      description: payload.description,
      listingType: payload.listingType || ListingType.SALE,
      visibility: payload.visibility || 'ALL_CREATORS' as any,
      askingPrice: payload.askingPrice,
      minAcceptablePrice: payload.minAcceptablePrice,
      currency: payload.currency || 'NGN',
      locationText: payload.locationText,
      city: payload.city,
      state: payload.state,
      country: payload.country || 'Nigeria',
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      status: PropertyStatus.DRAFT,
      media: payload.media || [],
      documents: payload.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    getStore().addProperty(newProperty);
    return newProperty;
  },

  // Update an existing property
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    await delay(250 + Math.random() * 200);
    
    const property = getStore().getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    getStore().updateProperty(id, updates);
    const updated = getStore().getPropertyById(id);
    if (!updated) {
      throw new Error('Failed to update property');
    }
    
    return updated;
  },

  // Submit property for verification
  async submitPropertyForVerification(id: string): Promise<Property> {
    await delay(400 + Math.random() * 200);
    
    const property = getStore().getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Validate required media (at least 1 image)
    const images = property.media.filter(m => m.type === 'IMAGE');
    if (images.length === 0) {
      throw new Error('At least one image is required before submitting for verification');
    }

    // Validate required documents based on listing type
    const requiredDocs = getRequiredDocuments(property.listingType);
    const hasRequiredDocs = requiredDocs.every(docType =>
      property.documents.some(doc => doc.docType === docType)
    );

    if (!hasRequiredDocs) {
      throw new Error(`Missing required documents for ${property.listingType} listing`);
    }

    // Transition: DRAFT -> SUBMITTED -> PENDING_VERIFICATION
    getStore().updateProperty(id, { status: PropertyStatus.SUBMITTED });
    
    // Simulate async transition to pending
    await delay(100);
    getStore().updateProperty(id, { status: PropertyStatus.PENDING_VERIFICATION });

    const updated = getStore().getPropertyById(id);
    if (!updated) {
      throw new Error('Failed to submit property');
    }
    
    return updated;
  },

  // Admin: Approve property
  async adminApproveProperty(id: string): Promise<Property> {
    await delay(300 + Math.random() * 200);
    
    const property = getStore().getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    getStore().updateProperty(id, { 
      status: PropertyStatus.VERIFIED,
      rejectionReason: undefined
    });

    const updated = getStore().getPropertyById(id);
    if (!updated) {
      throw new Error('Failed to approve property');
    }
    
    return updated;
  },

  // Admin: Reject property
  async adminRejectProperty(id: string, reason: string): Promise<Property> {
    await delay(300 + Math.random() * 200);
    
    const property = getStore().getPropertyById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    getStore().updateProperty(id, { 
      status: PropertyStatus.REJECTED,
      rejectionReason: reason
    });

    const updated = getStore().getPropertyById(id);
    if (!updated) {
      throw new Error('Failed to reject property');
    }
    
    return updated;
  },

  // List verified properties (for public browsing)
  async listVerifiedProperties(filters?: PropertyFilters): Promise<Property[]> {
    await delay(200 + Math.random() * 200);
    
    let properties = getStore().getVerifiedProperties();

    // Apply filters
    if (filters) {
      if (filters.q) {
        const query = filters.q.toLowerCase();
        properties = properties.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.locationText?.toLowerCase().includes(query)
        );
      }

      if (filters.listingType) {
        properties = properties.filter(p => p.listingType === filters.listingType);
      }

      if (filters.minPrice !== undefined) {
        properties = properties.filter(p => (p.askingPrice || 0) >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        properties = properties.filter(p => (p.askingPrice || 0) <= filters.maxPrice!);
      }

      if (filters.bedrooms !== undefined) {
        properties = properties.filter(p => p.bedrooms === filters.bedrooms);
      }

      if (filters.city) {
        properties = properties.filter(p => p.city?.toLowerCase() === filters.city?.toLowerCase());
      }

      if (filters.state) {
        properties = properties.filter(p => p.state?.toLowerCase() === filters.state?.toLowerCase());
      }
    }

    return properties;
  },

  // Admin: Get queue of properties awaiting review
  async listAdminQueue(): Promise<Property[]> {
    await delay(200 + Math.random() * 200);
    return getStore().getAdminQueue();
  },

  // Delete a property
  async deleteProperty(id: string): Promise<void> {
    await delay(200 + Math.random() * 200);
    getStore().deleteProperty(id);
  }
};

// Helper to get required documents based on listing type
function getRequiredDocuments(listingType: ListingType): DocType[] {
  switch (listingType) {
    case ListingType.SALE:
      return ['TITLE_DOC', 'SURVEY_PLAN', 'BUILDING_APPROVAL'];
    case ListingType.RENT:
      return ['PROOF_OF_OWNERSHIP'];
    case ListingType.LEAD_GEN:
      return [];
    default:
      return [];
  }
}

