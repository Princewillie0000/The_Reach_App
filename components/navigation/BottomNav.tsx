
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import { Home, Users, Wallet, User } from 'lucide-react';

interface Props {
  activeRole: UserRole;
}

const BottomNav: React.FC<Props> = ({ activeRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/dashboard" },
    { icon: <Users size={24} />, label: "Leads", path: "/leads" },
    { icon: <Wallet size={24} />, label: "Wallet", path: "/wallet" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center transition-all ${isActive ? 'text-reach-navy' : 'text-gray-400'}`}
          >
            <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            {isActive && <div className="w-1 h-1 bg-reach-navy rounded-full mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
