import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import EllipseBlur from '../dashboard/EllipseBlur';
import { Menu, Link, Sparkles } from 'lucide-react';
import { VideoMetadata, VideoSummary, SuggestedVideo } from './types';
import { extractVideoId, getVideoMetadata, getTranscript, generateSummary, getSuggestedVideos } from './api';
import SummaryResult from './SummaryResult';
import LoadingState from './LoadingState';
import { StoredSummary, SaveSummaryData } from '../lib/database';
import { useAuth } from '../auth/AuthContext';
import { saveSummary } from '../lib/database';

const NewSummary: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const storedSummary = location.state?.storedSummary as StoredSummary | undefined;
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [suggestedVideos, setSuggestedVideos] = useState<SuggestedVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      setVideoUrl(decodedUrl);
      
      // If we have a stored summary, use it instead of generating a new one
      if (storedSummary) {
        setMetadata({
          title: storedSummary.title,
          thumbnail: storedSummary.thumbnail,
          duration: storedSummary.duration
        });
        setSummary(storedSummary.summary);
        
        // Still fetch suggested videos
        const videoId = extractVideoId(decodedUrl);
        if (videoId) {
          setCurrentVideoId(videoId);
          getSuggestedVideos(videoId, storedSummary.title)
            .then(setSuggestedVideos)
            .catch(console.error);
        }
      } else {
        handleSummarize(decodedUrl);
      }
    }
  }, [searchParams, storedSummary]);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSummarize = async (url: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      setSummary(null);
      setMetadata(null);
      setSuggestedVideos([]);
      setCurrentStep(0);

      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      setCurrentVideoId(videoId);

      const videoMetadata = await getVideoMetadata(videoId);
      setMetadata(videoMetadata);
      setCurrentStep(1);

      const transcriptData = await getTranscript(videoId);
      const transcript = transcriptData.transcripts.map(t => t.text).join(' ');
      setCurrentStep(2);

      const summaryData = await generateSummary(transcript);
      setSummary(summaryData);
      setCurrentStep(3);

      // Save the summary immediately after generation if user is logged in
      // and this is not a stored summary being viewed
      if (user && !storedSummary) {
        const summaryToSave: SaveSummaryData = {
          userId: user.uid,
          videoId,
          title: videoMetadata.title,
          thumbnail: videoMetadata.thumbnail,
          duration: videoMetadata.duration,
          summary: summaryData
        };

        await saveSummary(summaryToSave);
      }

      const suggestedVideosData = await getSuggestedVideos(videoId, videoMetadata.title);
      setSuggestedVideos(suggestedVideosData);
    } catch (err) {
      console.error('Error in handleSummarize:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
      setCurrentStep(-1);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setVideoUrl(newUrl);
    handleSummarize(newUrl);
  };

  return (
    <main id="new-summary-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="new-summary-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="new-summary-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="new-summary-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="new-summary-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="new-summary-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="new-summary-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="new-summary-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="new-summary-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        
        <div id="new-summary-header" className="mb-8">
          <h1 id="new-summary-title" className="text-2xl font-medium text-black mb-2">
            Summarize a New Video in Seconds!
          </h1>
          <p id="new-summary-description" className="text-base text-gray-600">
            Turn long YouTube videos into concise, easy-to-read summaries, with the option to visualize key insights using Mind Maps.
          </p>
        </div>

        <div id="new-summary-form" className="bg-white rounded-lg p-6">
          <div id="new-summary-input-section" className="mb-6">
            <h2 id="new-summary-input-title" className="text-lg font-medium text-black mb-4">
              Paste Video Link
            </h2>
            <p id="new-summary-input-help" className="text-sm text-gray-600 mb-4">
              Need a video to start? Browse{" "}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#00A3FF] hover:text-[#0096FF] transition-colors inline-flex items-center gap-1"
              >
                YouTube
                <Link className="w-3 h-3" />
              </a>
              {" "}and copy the video's URL from your browser's address bar.
            </p>
            <div id="new-summary-input-container" className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  id="video-url"
                  placeholder="https://www.youtube.com/watch?v=YYWc9dFqROI&t=7s"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-3 text-sm rounded-md border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSummarize(videoUrl)}
                disabled={isProcessing || !videoUrl}
                className={`px-6 py-3 bg-[#00A3FF] text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#0096FF] transition-colors whitespace-nowrap ${
                  (isProcessing || !videoUrl) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Summarize Now'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          {isProcessing ? (
            <LoadingState currentStep={currentStep} />
          ) : (
            metadata && summary && (
              <SummaryResult 
                metadata={metadata} 
                summary={summary} 
                suggestedVideos={suggestedVideos}
                onVideoSelect={handleVideoSelect}
                storedMindMap={storedSummary?.mindMap}
                storedSummaryId={storedSummary?.id}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default NewSummary;