'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../../contexts/UserContext';
import { getMockSession } from '../../../../../lib/mockAuth';
import { ArrowLeft, Bell, ArrowUpRight, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  
  const transactions: Transaction[] = [
    { id: '1', type: 'deposit', amount: 2000, date: 'Jun 27th, 20:53:39', status: 'completed', description: 'Madebyrobb' },
    { id: '2', type: 'deposit', amount: 2000, date: 'Jun 27th, 20:53:39', status: 'completed', description: 'Madebyrobb' },
    { id: '3', type: 'deposit', amount: 2000, date: 'Jun 27th, 20:53:39', status: 'completed', description: 'Madebyrobb' },
    { id: '4', type: 'deposit', amount: 2000, date: 'Jun 27th, 20:53:39', status: 'completed', description: 'Madebyrobb' },
  ];

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (session.role !== 'DEVELOPER') {
      router.push('/properties');
      return;
    }
  }, [user, userLoading, session.role, router]);

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
        <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => router.push('/notifications')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Bell size={20} className="text-gray-700" />
        </button>
      </header>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-8">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <p className="text-gray-500">No transaction yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => router.push(`/dashboard/developer/wallet/transactions/${tx.id}`)}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <ArrowUpRight size={24} className="text-[#FF6B35] rotate-[225deg]" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{tx.description}</h5>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">+{tx.amount.toLocaleString()}</p>
                  </div>
                  {tx.status === 'completed' && (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

