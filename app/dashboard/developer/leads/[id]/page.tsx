'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../lib/mockAuth';
import { ArrowLeft, Bell, Star, MapPin, Bed, Bath, Square, Eye, Users, Calendar, Clock, User, MoreHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface LeadDetail {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  price: string;
  rating: number;
  reviewCount: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  views: number;
  leads: number;
  budget: string;
  note: string;
  status: 'New' | 'Booked inspection' | 'Contacted' | 'Converted';
  scheduledInspection?: {
    day: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
  };
  reminder?: string;
}

const MOCK_LEAD_DETAIL: LeadDetail = {
  id: '1',
  propertyTitle: '4 Bedroom duplex Apartment',
  propertyImage: 'https://picsum.photos/800/600?random=1',
  price: '₦20,000,000M',
  rating: 4.8,
  reviewCount: 20,
  location: '222A Freedom way, Lekki Phase 1. Lagos State.',
  bedrooms: 4,
  bathrooms: 3,
  sqft: 1400,
  views: 156,
  leads: 10,
  budget: '₦16M',
  note: 'I really love the architecture of the building but here is my budget.....',
  status: 'Booked inspection',
  scheduledInspection: {
    day: 'Monday',
    date: '12/15/2025',
    time: '9:00AM',
    location: '222A Freedom way, Lekki Phase 1. Lagos State.',
    attendees: 1
  },
  reminder: 'Notify 1 day before due date'
};

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const leadId = (params?.id as string) || '';

  useEffect(() => {
    if (!leadId) {
      router.push('/dashboard/developer/leads');
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

    // Load lead detail (mock for now)
    setTimeout(() => {
      setLead(MOCK_LEAD_DETAIL);
      setLoading(false);
    }, 500);
  }, [leadId, user, userLoading, session.role, router]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-orange-100 text-orange-700';
      case 'Booked inspection':
        return 'bg-green-100 text-green-700';
      case 'Contacted':
        return 'bg-blue-100 text-blue-700';
      case 'Converted':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFA] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#FDFBFA] p-6">
        <p className="text-gray-400">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#FDFBFA] px-6 py-4 flex items-center justify-between z-50">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Property Details</h1>
        <button
          onClick={() => router.push('/notifications')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Bell size={20} className="text-gray-700" />
        </button>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-32">
        {/* Property Image */}
        <div className="relative">
          <img
            src={lead.propertyImage}
            alt={lead.propertyTitle}
            className="w-full h-64 object-cover"
          />
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(lead.status)}`}>
            {lead.status === 'Booked inspection' ? '• Booked Inspection' : lead.status}
          </div>
          <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full">
            <MoreHorizontal size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 pt-6 space-y-6">
          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">{lead.price}</span>
            <div className="flex items-center gap-1">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-900">{lead.rating}({lead.reviewCount})</span>
            </div>
          </div>

          {/* Property Title */}
          <h2 className="text-xl font-bold text-gray-900">{lead.propertyTitle}</h2>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-red-500" />
            <span className="text-sm">{lead.location}</span>
          </div>

          {/* Key Features */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Bed size={18} />
              <span className="text-sm">{lead.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} />
              <span className="text-sm">{lead.bathrooms} Bathroom</span>
            </div>
            <div className="flex items-center gap-2">
              <Square size={18} />
              <span className="text-sm">{lead.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Performance Stats</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{lead.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{lead.leads}</span>
              </div>
            </div>
          </div>

          {/* Contract Status */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Contract Status</span>
            <button className="text-sm text-[#FF6B35] font-semibold hover:underline">
              View contract
            </button>
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Budget</span>
            <span className="text-sm font-semibold text-green-600">{lead.budget}</span>
          </div>

          {/* Note */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
            <div className="bg-gray-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700">{lead.note}</p>
            </div>
          </div>

          {/* Scheduled Inspection */}
          {lead.scheduledInspection && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Scheduled Inspection</h3>
              <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{lead.scheduledInspection.day}</span>
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{lead.scheduledInspection.attendees}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{lead.scheduledInspection.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={16} className="text-gray-400" />
                  <span>{lead.scheduledInspection.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{lead.scheduledInspection.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reminder */}
          {lead.reminder && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Reminder</h3>
              <p className="text-sm text-gray-700">{lead.reminder}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      {lead.status === 'Booked inspection' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button
              onClick={() => alert('Re-schedule functionality coming soon')}
              className="flex-1 py-3 rounded-2xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Re-schedule
            </button>
            <button
              onClick={() => alert('Confirm functionality coming soon')}
              className="flex-1 py-3 rounded-2xl font-semibold bg-reach-navy text-white hover:bg-reach-navy/90 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

