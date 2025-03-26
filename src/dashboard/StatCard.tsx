import React from "react";
import * as Icons from '@tabler/icons-react';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  const IconComponent = Icons[`Icon${icon.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}` as keyof typeof Icons];

  return (
    <article id={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`} className="p-3 md:p-4 rounded-lg bg-gray-50">
      {IconComponent && (
        <div id={`stat-card-icon-container-${label.toLowerCase().replace(/\s+/g, '-')}`} className="mb-2 md:mb-3">
          <IconComponent id={`stat-card-icon-${label.toLowerCase().replace(/\s+/g, '-')}`} className="w-5 h-5 text-slate-600" />
        </div>
      )}
      <h3 id={`stat-card-value-${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg md:text-xl font-semibold text-slate-900 mb-1">
        {value}
      </h3>
      <p id={`stat-card-label-${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs md:text-sm text-slate-500">
        {label}
      </p>
    </article>
  );
};

export default StatCard;