import React from "react";

const WelcomeSection: React.FC = () => {
  return (
    <section id="welcome-section" className="mb-6 md:mb-8">
      <h1 id="welcome-title" className="mb-2 text-xl md:text-2xl font-semibold text-slate-900">
        Welcome back Maverick! Ready to squeeze hours of content into just
        minutes?
      </h1>
      <p id="welcome-description" className="text-sm md:text-base text-slate-500">
        Transform any YouTube video into actionable knowledge.
      </p>
    </section>
  );
};

export default WelcomeSection;