
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, User, PropertyStatus } from './types';

// Pages
import Landing from './pages/Landing';
import RoleSelection from './pages/auth/RoleSelection';
import VerificationFlow from './pages/auth/VerificationFlow';
import DeveloperRegistration from './pages/auth/DeveloperRegistration';
import CreatorRegistration from './pages/auth/CreatorRegistration';
import BuyerRegistration from './pages/auth/BuyerRegistration';
import DeveloperDashboard from './pages/dashboards/DeveloperDashboard';
import CreatorDashboard from './pages/dashboards/CreatorDashboard';
import BuyerDashboard from './pages/dashboards/BuyerDashboard';
import WalletPage from './pages/WalletPage';
import PropertyDetail from './pages/PropertyDetail';
import NotificationPage from './pages/NotificationPage';

// Components
import BottomNav from './components/navigation/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulation of auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-reach-light">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-reach-navy border-t-transparent animate-spin mb-4"></div>
          <p className="text-reach-navy font-semibold">The Reach App</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen max-w-lg mx-auto bg-white shadow-xl relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/role-selection" element={<RoleSelection onSelectRole={(role) => {
             // Mock temp user creation during onboarding
             console.log("Role selected:", role);
          }} />} />
          <Route path="/register/developer" element={<DeveloperRegistration onComplete={(u) => handleSetUser(u)} />} />
          <Route path="/register/creator" element={<CreatorRegistration onComplete={(u) => handleSetUser(u)} />} />
          <Route path="/register/buyer" element={<BuyerRegistration onComplete={(u) => handleSetUser(u)} />} />
          <Route path="/verify" element={<VerificationFlow onComplete={(u) => handleSetUser(u)} />} />
          
          <Route path="/dashboard" element={
            !user ? <Navigate to="/" /> : 
            user.role === UserRole.DEVELOPER ? <DeveloperDashboard user={user} /> :
            user.role === UserRole.CREATOR ? <CreatorDashboard user={user} /> :
            <BuyerDashboard user={user} />
          } />

          <Route path="/wallet" element={user ? <WalletPage user={user} /> : <Navigate to="/" />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/notifications" element={<NotificationPage />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {user && <BottomNav activeRole={user.role} />}
      </div>
    </Router>
  );
};

export default App;
