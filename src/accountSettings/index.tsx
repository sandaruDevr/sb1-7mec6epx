import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import EllipseBlur from '../dashboard/EllipseBlur';
import { Menu } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'subscription'>('account');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('notifications')) {
      setActiveTab('notifications');
    } else if (path.includes('subscription')) {
      setActiveTab('subscription');
    } else if (path.includes('account')) {
      setActiveTab('account');
    }
  }, [location.pathname]);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleTabChange = (tab: 'account' | 'notifications' | 'subscription') => {
    setActiveTab(tab);
    navigate(`/settings/${tab}`);
  };

  return (
    <main id="account-settings-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="account-settings-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="account-settings-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="account-settings-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="account-settings-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="account-settings-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="account-settings-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="account-settings-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="account-settings-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        <div id="account-settings-header" className="mb-8">
          <h1 id="account-settings-title" className="text-2xl font-medium text-black mb-6">
            Manage Your Account & Preferences
          </h1>
          <div id="account-settings-tabs" className="flex gap-8 border-b border-gray-200">
            <button
              id="account-tab-button"
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'account'
                  ? 'text-[#00A3FF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A3FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => handleTabChange('account')}
            >
              Account Details
            </button>
            <button
              id="notifications-tab-button"
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'notifications'
                  ? 'text-[#00A3FF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A3FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => handleTabChange('notifications')}
            >
              Notification Settings
            </button>
            <button
              id="subscription-tab-button"
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'subscription'
                  ? 'text-[#00A3FF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A3FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => handleTabChange('subscription')}
            >
              Subscription
            </button>
          </div>
        </div>
        <Outlet />
      </section>
    </main>
  );
};

export default AccountSettings;