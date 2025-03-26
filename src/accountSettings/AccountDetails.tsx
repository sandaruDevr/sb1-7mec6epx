import React from 'react';
import { Zap, PenSquare, LogOut } from 'lucide-react';

const AccountDetails: React.FC = () => {
  return (
    <div id="account-details-container" className="w-auto">
      <div id="account-details-form" className="bg-white rounded-lg p-6 mb-6">
        <h2 id="account-details-profile-title" className="text-lg font-medium text-black mb-6">
          Your Profile
        </h2>
        <div className="space-y-4">
          <div id="name-section">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Username"
              className="w-full p-3 text-sm rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
            />
          </div>
          <div id="email-section">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="User email address"
              className="w-full p-3 text-sm rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
            />
          </div>
          <div id="password-section">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="User password"
              className="w-full p-3 text-sm rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
            />
          </div>
        </div>
        <div className="flex justify-end mt-[15px]">
          <button
            id="edit-profile-button"
            className="px-4 py-2 bg-[#00A3FF] text-white rounded-md hover:bg-[#0096FF] transition-colors flex items-center gap-2 text-sm"
          >
            <PenSquare className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div id="account-upgrade-banner" className="bg-[#00A3FF] rounded-lg p-6 text-white">
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

      <div id="account-signout" className="mt-6 px-[22px] py-[30px] rounded-[10px] border border-[rgba(229,0,0,0.09)] bg-[rgba(229,0,0,0.04)]">
        <button
          className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;