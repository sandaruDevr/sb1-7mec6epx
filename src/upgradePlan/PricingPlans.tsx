import React from 'react';
import PricingCard from './PricingCard';

const PricingPlans: React.FC = () => {
  const freePlanFeatures = [
    '2 free AI summaries per day - No sign-up needed!',
    'Summarize videos up to 4 hours long - Extract key insights from lectures, tutorials, and podcasts.',
    'AI-Generated Mindmaps - Visualize connections between concepts.',
    'Precision takeaways - Identify the most valuable moments without watching entire videos.',
  ];

  const proPlanFeatures = [
    'Unlimited AI summaries - No limits, no restrictions!',
    'Summarize videos up to 4 hours long - Extract key insights from lectures, tutorials, and podcasts.',
    'AI-Generated Mindmaps - Visualize connections between concepts.',
    'Precision takeaways - Identify the most valuable moments without watching entire videos.',
  ];

  return (
    <div id="pricing-container" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="w-full">
        <PricingCard
          id="free-plan"
          title="Free Forever Plan"
          price="0"
          description="Start immediately—no account needed!"
          features={freePlanFeatures}
          buttonText="Summarize Now"
          onClick={() => console.log('Free plan selected')}
        />
      </div>
      <div className="w-full">
        <PricingCard
          id="pro-plan"
          title="Pro Plan"
          price="28"
          description="Try unlimited summaries free for 3 days!"
          subDescription="No commitment. Cancel anytime."
          features={proPlanFeatures}
          buttonText="Start Your 3-Day Free Trial Now"
          onClick={() => console.log('Pro plan selected')}
          popular
        />
      </div>
    </div>
  );
};

export default PricingPlans;