import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  subDescription?: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
  popular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  id,
  title,
  price,
  description,
  subDescription,
  features,
  buttonText,
  onClick,
  popular,
}) => {
  return (
    <div
      id={`pricing-card-${id}`}
      className="bg-white rounded-lg p-8 relative h-full flex flex-col"
    >
      {popular && (
        <div
          id={`pricing-card-${id}-popular`}
          className="absolute -top-3 right-4 bg-[#00A3FF] text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Most Popular
        </div>
      )}
      <div id={`pricing-card-${id}-header`} className="mb-6">
        <h2 id={`pricing-card-${id}-title`} className="text-2xl font-medium text-black mb-2">
          {title}
        </h2>
        <p id={`pricing-card-${id}-description`} className="text-black text-base">
          {description}
        </p>
        {subDescription && (
          <p id={`pricing-card-${id}-sub-description`} className="text-black text-base">
            {subDescription}
          </p>
        )}
      </div>
      <div id={`pricing-card-${id}-pricing`} className="mb-8">
        <div className="flex items-baseline">
          <span className="text-3xl font-medium text-black">$</span>
          <span className="text-3xl font-medium text-black">{price}</span>
          <span className="text-base text-black ml-1">/per month</span>
        </div>
      </div>
      <div id={`pricing-card-${id}-features`} className="flex-grow mb-8">
        <h3 id={`pricing-card-${id}-features-title`} className="text-black text-base font-medium mb-4">
          What's Included:
        </h3>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={index}
              id={`pricing-card-${id}-feature-${index}`}
              className="flex items-start gap-3 text-base text-black"
            >
              <Check className="w-5 h-5 text-[#00A3FF] flex-shrink-0 mt-1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        id={`pricing-card-${id}-button`}
        onClick={onClick}
        className="w-full py-4 rounded-lg flex items-center justify-center gap-2 text-base font-medium text-white bg-[#00A3FF] hover:bg-[#0096FF] transition-colors"
      >
        <Sparkles className="w-5 h-5" />
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard;