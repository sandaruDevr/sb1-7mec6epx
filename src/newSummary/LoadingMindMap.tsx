import React from 'react';
import { Brain } from 'lucide-react';

const LoadingMindMap: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-[#E5F3FF] border-t-[#00A3FF] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#E5F3FF] border-b-[#00A3FF] rounded-full animate-spin-reverse"></div>
          <Brain className="absolute inset-4 w-8 h-8 text-[#00A3FF]" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          Generating Mind Map
        </h3>
        <p className="text-gray-600 mb-4">
          Our AI is analyzing the video content and creating an intuitive mind map visualization...
        </p>
        
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#00A3FF] rounded-full w-3/4 animate-pulse"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Analyzing concepts</span>
            <span>75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMindMap;