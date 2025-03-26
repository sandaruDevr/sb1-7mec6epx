import React from 'react';
import { Brain, FileText, Video, Share2 } from 'lucide-react';

interface ProcessStep {
  icon: React.ReactNode;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

const LoadingState: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps: ProcessStep[] = [
    {
      icon: <Video className="w-5 h-5" />,
      label: 'Fetching video metadata...',
      status: currentStep >= 0 ? currentStep === 0 ? 'active' : 'completed' : 'pending'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Analyzing content...',
      status: currentStep >= 1 ? currentStep === 1 ? 'active' : 'completed' : 'pending'
    },
    {
      icon: <Brain className="w-5 h-5" />,
      label: 'Generating summary...',
      status: currentStep >= 2 ? currentStep === 2 ? 'active' : 'completed' : 'pending'
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: 'Fetching suggested videos...',
      status: currentStep >= 3 ? currentStep === 3 ? 'active' : 'completed' : 'pending'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-4 border-[#E5F3FF] border-t-[#00A3FF] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#E5F3FF] border-b-[#00A3FF] rounded-full animate-spin-reverse"></div>
        </div>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-4 transition-all duration-300 ${
                step.status === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  step.status === 'active' ? 'bg-blue-100 text-[#00A3FF]' :
                  'bg-gray-100 text-gray-400'}
                ${step.status === 'active' ? 'animate-pulse' : ''}
              `}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'active' ? 'text-[#00A3FF]' :
                  step.status === 'completed' ? 'text-green-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {step.status === 'active' && (
                  <div className="mt-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00A3FF] rounded-full w-1/2 animate-progress"></div>
                  </div>
                )}
              </div>
              {step.status === 'completed' && (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;