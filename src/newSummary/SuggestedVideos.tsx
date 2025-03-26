import React, { useState } from 'react';
import { SuggestedVideo } from './types';
import { Clock, Eye, Play, Plus } from 'lucide-react';

interface SuggestedVideosProps {
  videos: SuggestedVideo[];
  onVideoSelect: (videoId: string) => void;
  onLoadMore: () => void;
  isLoading?: boolean;
}

const SuggestedVideos: React.FC<SuggestedVideosProps> = ({ 
  videos, 
  onVideoSelect, 
  onLoadMore,
  isLoading = false 
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Popular Related Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => onVideoSelect(video.id)}
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 
                className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-[#00A3FF] transition-colors" 
                title={video.title}
              >
                {video.title}
              </h3>
              <div className="text-xs text-gray-600">
                <p className="mb-2 line-clamp-1">{video.channelTitle}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{video.viewCount} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00A3FF] rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {isLoading ? 'Loading...' : 'See More Videos'}
        </button>
      </div>
    </div>
  );
};

export default SuggestedVideos;