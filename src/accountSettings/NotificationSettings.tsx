import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [exportNotifications, setExportNotifications] = useState(true);

  return (
    <div id="notification-settings-container" className="w-auto">
      <div id="notification-settings-content" className="bg-white rounded-lg p-6 mb-6">
        <h2 id="notification-settings-title" className="text-lg font-medium text-black mb-6">
          Export Notifications
        </h2>
        <div id="notification-settings-option" className="flex items-center justify-between">
          <p id="notification-settings-description" className="text-sm text-gray-600">
            Show a notification each time your summary is exported.
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={exportNotifications}
              onChange={(e) => setExportNotifications(e.target.checked)}
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer ${
              exportNotifications ? 'peer-checked:bg-[#00A3FF]' : ''
            } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
          </label>
        </div>
      </div>

      <div id="notification-settings-upgrade" className="bg-[#00A3FF] rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Unlock More Summaries & Features
            </h2>
            <p className="text-sm opacity-90">
              Upgrade to Pro: Unlimited summaries, unlimited learning potential.
            </p>
          </div>
          <button
            className="px-4 py-2 bg-white rounded-lg text-[#00A3FF] font-medium text-sm flex items-center gap-1.5 hover:bg-opacity-90 transition-colors justify-center md:self-auto"
          >
            <Zap className="w-4 h-4" />
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;