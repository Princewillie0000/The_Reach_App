import { Inspection, InspectionStatus, InspectionType } from '../../types/inspection';
import { propertyApi } from './propertyApi';

// Mock inspections data
let mockInspections: Inspection[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    propertyTitle: '4 Bedroom Duplex Apartment',
    propertyLocation: '222A Freedom way, Lekki Phase 1, Lagos',
    propertyImage: 'https://picsum.photos/400/300?random=1',
    type: InspectionType.INITIAL,
    status: InspectionStatus.SCHEDULED,
    scheduledDate: '2024-02-15',
    scheduledTime: '10:00',
    inspectorName: 'John Doe',
    inspectorContact: '+234 801 234 5678',
    notes: 'Initial inspection for property verification',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '2',
    propertyId: 'prop-2',
    propertyTitle: 'Minimalist Modern Flat',
    propertyLocation: 'Banana Island, Ikoyi, Lagos',
    propertyImage: 'https://picsum.photos/400/300?random=2',
    type: InspectionType.FOLLOW_UP,
    status: InspectionStatus.PENDING,
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    notes: 'Follow-up inspection after initial review',
    createdAt: '2024-02-12T10:00:00Z',
    updatedAt: '2024-02-12T10:00:00Z',
  },
];

export const inspectionApi = {
  // List all inspections for a developer
  listInspections: async (developerId: string): Promise<Inspection[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockInspections];
  },

  // Get inspection by ID
  getInspectionById: async (id: string): Promise<Inspection | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInspections.find(i => i.id === id) || null;
  },

  // Book a new inspection
  bookInspection: async (data: {
    propertyId: string;
    type: InspectionType;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }): Promise<Inspection> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fetch property details
    const property = await propertyApi.getPropertyById(data.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const newInspection: Inspection = {
      id: `insp-${Date.now()}`,
      propertyId: data.propertyId,
      propertyTitle: property.title,
      propertyLocation: property.locationText || 'Location not specified',
      propertyImage: property.media[0]?.url,
      type: data.type,
      status: InspectionStatus.PENDING,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockInspections.push(newInspection);
    return newInspection;
  },

  // Update inspection
  updateInspection: async (id: string, updates: Partial<Inspection>): Promise<Inspection> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockInspections.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Inspection not found');
    }

    mockInspections[index] = {
      ...mockInspections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return mockInspections[index];
  },

  // Cancel inspection
  cancelInspection: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInspections.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Inspection not found');
    }

    mockInspections[index] = {
      ...mockInspections[index],
      status: InspectionStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    };
  },
};

