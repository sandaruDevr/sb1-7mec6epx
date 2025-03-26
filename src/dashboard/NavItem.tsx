import React from "react";
import * as Icons from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  text: string;
  path?: string;
  isActive?: boolean;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, path, isActive: propIsActive, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = propIsActive ?? (path ? location.pathname === path : false);

  const IconComponent = Icons[`Icon${icon.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}` as keyof typeof Icons];

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      id={`nav-item-${text.toLowerCase().replace(/\s+/g, '-')}`}
      className={`flex items-center gap-2 py-[15px] px-3 self-stretch rounded cursor-pointer ${
        isActive ? "bg-[#EBF6FF] text-[#00A3FF]" : "text-gray-600 hover:bg-gray-50"
      } ${className}`}
      onClick={handleClick}
    >
      {IconComponent && (
        <IconComponent 
          id={`nav-icon-${text.toLowerCase().replace(/\s+/g, '-')}`}
          className={`w-5 h-5 ${isActive ? "text-[#00A3FF]" : "text-gray-500"}`} 
        />
      )}
      <span 
        id={`nav-text-${text.toLowerCase().replace(/\s+/g, '-')}`} 
        className="text-sm font-medium"
      >
        {text}
      </span>
    </div>
  );
};

export default NavItem;