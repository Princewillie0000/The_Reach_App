'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMockSession, setMockRole, UserRole } from '../../lib/mockAuth';
import { Settings } from 'lucide-react';

export function RoleSwitcher() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('DEVELOPER');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const session = getMockSession();
    setCurrentRole(session.role);
  }, []);

  const roles: UserRole[] = ['DEVELOPER', 'CREATOR', 'BUYER', 'ADMIN'];

  const handleRoleChange = (role: UserRole) => {
    setMockRole(role);
    setCurrentRole(role);
    setIsOpen(false);
    
    // Redirect based on role
    if (role === 'ADMIN') {
      router.push('/admin/properties');
    } else if (role === 'DEVELOPER') {
      router.push('/dashboard/developer');
    } else {
      router.push('/properties');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-reach-navy text-white rounded-full shadow-lg hover:bg-reach-navy/90 transition-colors"
          title="Switch Role (Dev Only)"
        >
          <Settings size={20} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[200px]">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Current: {currentRole}</p>
            </div>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  currentRole === role ? 'bg-reach-navy/10 font-semibold' : ''
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

