import React, { useState } from "react";
import Sidebar from "./Sidebar";
import WelcomeSection from "./WelcomeSection";
import SummarizeVideoSection from "./SummarizeVideoSection";
import RecentSummaries from "./RecentSummaries";
import StatsSection from "./StatsSection";
import UpgradeBanner from "./UpgradeBanner";
import EllipseBlur from "./EllipseBlur";
import { Menu } from "lucide-react";

const SummaryDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  return (
    <main id="dashboard-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="dashboard-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="dashboard-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="dashboard-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="dashboard-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="dashboard-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="dashboard-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="dashboard-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="dashboard-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        <WelcomeSection />
        <SummarizeVideoSection />
        <RecentSummaries />
        <StatsSection />
        <UpgradeBanner />
      </section>
    </main>
  );
};

export default SummaryDashboard;