'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../contexts/UserContext';
import { getMockSession } from '../../../../lib/mockAuth';
import { Bell, Menu, Eye, EyeOff, ArrowUpRight, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const session = getMockSession();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [walletSetupComplete, setWalletSetupComplete] = useState(false);
  
  const availableBalance = 10500.00;
  const lockedBalance = 10500.00;
  
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

    // Check if wallet is set up
    const walletSetup = localStorage.getItem('wallet-setup-complete');
    if (walletSetup === 'true') {
      setWalletSetupComplete(true);
    } else {
      // Show setup modal if wallet not set up
      setShowSetupModal(true);
    }
  }, [user, userLoading, session.role, router]);

  const handleSetupWallet = () => {
    setShowSetupModal(false);
    router.push('/dashboard/developer/wallet/setup-pin');
  };

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
        <h1 className="text-lg font-semibold text-gray-900">Wallet</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/notifications')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Bell size={20} className="text-gray-700" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 pb-8 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Available Balance</p>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {showBalance ? `₦ ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦ ****'}
            </h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Locked Balance</p>
            <p className="text-lg font-semibold text-gray-900">₦ {lockedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/developer/wallet/withdraw')}
              className="flex-1 bg-reach-navy text-white font-semibold py-3 rounded-2xl hover:bg-reach-navy/90 transition-colors"
            >
              Withdraw
            </button>
            <button
              onClick={() => router.push('/dashboard/developer/wallet/add-funds')}
              className="flex-1 bg-white border-2 border-reach-navy text-reach-navy font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              +Add funds
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent transactions</h3>
            <button 
              onClick={() => router.push('/dashboard/developer/wallet/transactions')}
              className="text-sm text-reach-navy font-semibold"
            >
              View all
            </button>
          </div>

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

      {/* Wallet Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[50vh] p-6 pb-8">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowSetupModal(false)}
                className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center"
              >
                <span className="text-white text-2xl font-bold">×</span>
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Setup up your wallet</h2>
            
            <button
              onClick={handleSetupWallet}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 mb-1">Setup your wallet</p>
                <p className="text-sm text-gray-500">Enjoy all functionality from your wallet feature by completing your wallet setup</p>
              </div>
              <ChevronRight size={20} className="text-[#FF6B35]" />
            </button>
          </div>
        </div>
      )}

      {/* Home Indicator */}
      <div className="h-0.5 bg-gray-900 w-32 mx-auto mb-2 rounded-full"></div>
    </div>
  );
}

