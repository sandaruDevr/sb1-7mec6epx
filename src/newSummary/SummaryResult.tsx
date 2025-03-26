import React, { useState } from 'react';
import { VideoMetadata, VideoSummary, SuggestedVideo, MindMapNode } from './types';
import { Clock, Search, ThumbsUp, ThumbsDown, RotateCw, Share, Download } from 'lucide-react';
import SuggestedVideos from './SuggestedVideos';
import { getSuggestedVideos, generateMindMap } from './api';
import MindMap from './MindMap';
import LoadingMindMap from './LoadingMindMap';
import { useAuth } from '../auth/AuthContext';
import { updateSummaryMindMap } from '../lib/database';

interface SummaryResultProps {
  metadata: VideoMetadata;
  summary: VideoSummary;
  suggestedVideos: SuggestedVideo[];
  onVideoSelect: (videoId: string) => void;
  storedMindMap?: MindMapNode;
  storedSummaryId?: string;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ 
  metadata, 
  summary, 
  suggestedVideos: initialSuggestedVideos,
  onVideoSelect,
  storedMindMap,
  storedSummaryId
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedVideos, setSuggestedVideos] = useState(initialSuggestedVideos);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'mindmap'>('summary');
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(storedMindMap || null);
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestions(true);
    }, 500);

    const videoIdMatch = metadata.thumbnail.match(/\/vi\/([^/]+)\//);
    if (videoIdMatch) {
      setCurrentVideoId(videoIdMatch[1]);
    }

    return () => clearTimeout(timer);
  }, [metadata]);

  const handleTabChange = async (tab: 'summary' | 'mindmap') => {
    setActiveTab(tab);
    
    if (tab === 'mindmap' && !mindMapData) {
      try {
        setIsGeneratingMindMap(true);
        const data = await generateMindMap(summary);
        setMindMapData(data);
        
        // Update the stored summary with the new mind map
        if (user && currentVideoId && storedSummaryId) {
          await updateSummaryMindMap(user.uid, storedSummaryId, data);
        }
      } catch (error) {
        console.error('Error generating mind map:', error);
      } finally {
        setIsGeneratingMindMap(false);
      }
    }
  };

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      const moreVideos = await getSuggestedVideos(
        currentVideoId || suggestedVideos[0]?.id || '', 
        metadata.title,
        10
      );
      
      const existingIds = new Set(suggestedVideos.map(v => v.id));
      const newVideos = moreVideos.filter(v => 
        !existingIds.has(v.id) && 
        v.id !== currentVideoId
      );
      
      setSuggestedVideos(prev => [...prev, ...newVideos]);
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDownload = () => {
    const content = `
${metadata.title}
Duration: ${metadata.duration}

${summary.sections.map(section => `
[${section.timestamp}]
${section.title}

${section.description}

${section.topics.map(topic => `
${topic.title}:
${topic.points.map(point => `• ${point}`).join('\n')}`).join('\n')}
`).join('\n')}

AI-Summarized by Summary.gg — transforming the way the world learns.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={metadata.thumbnail}
          alt={metadata.title}
          className="w-full md:w-[400px] h-[225px] object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{metadata.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Duration {metadata.duration}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'summary' 
              ? 'bg-[#00A3FF] text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => handleTabChange('summary')}
        >
          Summary
        </button>
        <button 
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'mindmap' 
              ? 'bg-[#00A3FF] text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => handleTabChange('mindmap')}
        >
          Mind Map
        </button>
      </div>

      {activeTab === 'summary' && (
        <>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search within summary..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex gap-2 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ThumbsDown className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RotateCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Share className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg text-[#00A3FF]"
              title="Download summary"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {summary.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-2 border border-gray-200 rounded px-2 py-1 inline-block">
                    {section.timestamp}
                  </span>
                  <h3 className="text-lg font-medium mb-2 bg-yellow-100 inline-block px-2 py-1 rounded">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <div className="space-y-4">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex}>
                        <h4 className="font-medium mb-2">{topic.title}</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {topic.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="text-gray-600">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'mindmap' && (
        <>
          {isGeneratingMindMap && <LoadingMindMap />}
          {!isGeneratingMindMap && mindMapData && <MindMap data={mindMapData} />}
        </>
      )}

      <div className="mt-8 text-center text-sm text-gray-500 italic border-t border-gray-200 pt-4">
        AI-Summarized by Summary.gg — transforming the way the world learns.
      </div>

      {showSuggestions && suggestedVideos.length > 0 && (
        <SuggestedVideos 
          videos={suggestedVideos} 
          onVideoSelect={onVideoSelect}
          onLoadMore={handleLoadMore}
          isLoading={isLoadingMore}
        />
      )}
    </div>
  );
};

export default SummaryResult;