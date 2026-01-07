'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../../lib/mockAuth';
import { ArrowLeft, Bell } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }

    // Mock transaction data
    setTransaction({
      id: params.id,
      status: 'Successful',
      amount: 'N40M',
      type: 'Debit',
      date: '12-23-2025',
      unitSold: '8 Unit',
      estimatedCommission: 'N4M',
      totalAmount: 'N44M'
    });
  }, [user, userLoading, session.role, router, params.id]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBFA] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      {/* Header */}
      <header className="bg-transparent px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Transaction details</h1>
        <button
          onClick={() => router.push('/notifications')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Bell size={20} className="text-gray-700" />
        </button>
      </header>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-32">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          {/* Transaction Status */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Transaction status</span>
            <span className="text-sm font-semibold text-green-600">{transaction?.status || 'N/A'}</span>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.amount || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Type</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.type || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.date || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Unit sold</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.unitSold || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Estimated commission</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.estimatedCommission || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Total amount</span>
              <span className="text-sm font-semibold text-gray-900">{transaction?.totalAmount || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 pb-8">
        <div className="h-0.5 bg-gray-900 w-32 mx-auto mb-4 rounded-full"></div>
        <button
          onClick={() => {
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: 'Transaction Details',
                text: `Transaction ${transaction?.id || ''} - ${transaction?.amount || ''}`
              });
            } else {
              alert('Share functionality not available');
            }
          }}
          className="w-full bg-reach-navy text-white font-semibold py-4 rounded-2xl hover:bg-reach-navy/90 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
}

