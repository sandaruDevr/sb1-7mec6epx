import React from "react";
import { Zap } from "lucide-react";

const UpgradeBanner: React.FC = () => {
  const handleUpgrade = () => {
    console.log("User clicked upgrade");
  };

  return (
    <section id="upgrade-banner-section" className="p-4 md:p-6 bg-[#00A3FF] rounded-lg text-white">
      <div id="upgrade-banner-container" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div id="upgrade-banner-content">
          <h2 id="upgrade-banner-title" className="text-lg md:text-xl font-semibold mb-1">
            Unlock More Summaries & Features
          </h2>
          <p id="upgrade-banner-description" className="text-sm opacity-90">
            Upgrade to Pro: Unlimited summaries, unlimited learning potential.
          </p>
        </div>
        <button
          id="upgrade-banner-button"
          className="px-4 py-2 bg-white rounded-lg text-[#00A3FF] font-medium text-sm flex items-center gap-1.5 hover:bg-opacity-90 transition-colors justify-center md:self-auto"
          onClick={handleUpgrade}
        >
          <Zap id="upgrade-banner-icon" className="w-4 h-4" />
          Upgrade Now
        </button>
      </div>
    </section>
  );
};

export default UpgradeBanner;