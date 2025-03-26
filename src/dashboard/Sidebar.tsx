import React from "react";
import NavItem from "./NavItem";
import { FileText, ChevronRight, Zap, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: "layout-dashboard", text: "Dashboard", path: "/" },
    { icon: "plus", text: "New Summary", path: "/new" },
    { icon: "history", text: "Summaries History", path: "/history" },
    { icon: "crown", text: "Upgrade Plan", path: "/upgrade" },
    { icon: "bell", text: "Notifications & Updates", path: "/settings/notifications", className: "mt-[41px]" },
    { icon: "settings", text: "Account Settings", path: "/settings/account" },
    { icon: "help-circle", text: "Help & Support", path: "/help" },
  ];

  return (
    <>
      <div 
        id="sidebar-overlay"
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        id="sidebar" 
        className={`fixed md:static flex flex-col h-auto w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 top-0 left-0`}
      >
        <header id="sidebar-header" className="p-4 border-b border-gray-200">
          <div id="sidebar-logo" className="flex items-center gap-2">
            <FileText id="sidebar-logo-icon" className="w-5 h-5 text-[#009EFF]" />
            <span id="sidebar-logo-text" className="logo-text">Summary.gg</span>
          </div>
        </header>

        <button
          id="sidebar-close-button"
          className="md:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <X id="sidebar-close-icon" className="w-5 h-5 text-gray-500" />
        </button>

        <nav id="sidebar-nav" className="flex-1 px-[5px] py-[20px]">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              text={item.text}
              path={item.path}
              className={item.className}
            />
          ))}
        </nav>

        <div id="sidebar-footer" className="px-3 pb-4">
          <div id="sidebar-usage-stats" className="flex flex-col justify-center items-start gap-2 p-[15px_12px] border-[0.5px] border-black/15 rounded-[4px] mb-3">
            <div id="sidebar-usage-content" className="flex flex-col justify-center items-start gap-3 self-stretch">
              <div id="sidebar-usage-count" className="videos-summarized">1/2 Videos Summarized</div>
              <div id="sidebar-usage-refresh" className="refresh-text">Refreshes each day at 12:00 PM</div>
              <div id="sidebar-usage-progress" className="h-2 w-full bg-[#E5F3FF] rounded-full overflow-hidden">
                <div id="sidebar-usage-progress-bar" className="w-1/2 h-full bg-[#009EFF]"></div>
              </div>
              <button id="sidebar-upgrade-button" className="w-full flex items-center gap-2">
                <Zap id="sidebar-upgrade-icon" className="w-4 h-4 text-[#009EFF]" />
                <span id="sidebar-upgrade-text" className="upgrade-text">Upgrade Now</span>
              </button>
            </div>
          </div>

          <div id="sidebar-profile" className="flex h-[40px] px-[9.829px] py-[15px] justify-between items-center border-[0.5px] border-black/15 rounded-[5px] bg-white">
            <div id="sidebar-profile-info" className="flex items-center gap-2">
              <img
                id="sidebar-profile-image"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces"
                alt="Alicia Koch"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span id="sidebar-profile-name" className="profile-name">Alicia Koch</span>
            </div>
            <ChevronRight id="sidebar-profile-chevron" className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;