import React from 'react';
import Sidebar from '../dashboard/Sidebar';
import EllipseBlur from '../dashboard/EllipseBlur';
import PricingPlans from './PricingPlans';
import { Menu } from 'lucide-react';

const UpgradePlan: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  return (
    <main id="upgrade-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="upgrade-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="upgrade-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="upgrade-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="upgrade-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="upgrade-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="upgrade-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="upgrade-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="upgrade-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        <div id="upgrade-header" className="mb-8">
          <h1 id="upgrade-title" className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Upgrade Your Plan & Unlock More Power
          </h1>
          <p id="upgrade-description" className="text-base text-slate-500">
            Get more summaries, longer video support, and exclusive features to maximize your learning efficiency.
          </p>
        </div>
        <PricingPlans />
      </section>
    </main>
  );
};

export default UpgradePlan;