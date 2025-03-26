import React from 'react';
import Sidebar from '../dashboard/Sidebar';
import EllipseBlur from '../dashboard/EllipseBlur';
import SummaryList from './SummaryList';
import { Menu } from 'lucide-react';

const SummariesHistory: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  return (
    <main id="summaries-history-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="summaries-history-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="summaries-history-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="summaries-history-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="summaries-history-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="summaries-history-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="summaries-history-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="summaries-history-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="summaries-history-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        <div id="summaries-history-header" className="mb-8">
          <h1 id="summaries-history-title" className="text-2xl font-medium text-black mb-2">
            Your Summaries, All in One Place
          </h1>
          <p id="summaries-history-description" className="text-base text-black">
            Easily access, review, and manage all your past video summaries
          </p>
        </div>
        <SummaryList />
      </section>
    </main>
  );
};

export default SummariesHistory;