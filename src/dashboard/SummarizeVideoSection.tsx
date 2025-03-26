import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const SummarizeVideoSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  const handleSummarize = () => {
    if (videoUrl) {
      // Encode the URL to handle special characters
      const encodedUrl = encodeURIComponent(videoUrl);
      navigate(`/new?url=${encodedUrl}`);
    }
  };

  return (
    <section id="summarize-section" className="p-4 md:p-6 mb-6 md:mb-8 rounded-lg bg-white">
      <h2 id="summarize-title" className="mb-4 text-base font-semibold text-slate-900">
        Summarize a New Video
      </h2>
      <p id="summarize-description" className="mb-4 text-sm text-slate-500">
        Need a video to start? Browse{" "}
        <a id="summarize-youtube-link" href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#00A3FF] cursor-pointer">
          YouTube
        </a>{" "}
        and copy the video's URL from your browser's address bar.
      </p>
      <div id="summarize-input-container" className="flex flex-col md:flex-row gap-3">
        <input
          id="summarize-input-url"
          type="text"
          placeholder="Paste YouTube Video URL"
          className="flex-1 p-3 text-sm rounded-md border border-gray-200 placeholder-gray-400"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button
          id="summarize-button-submit"
          className={`px-6 py-3 font-medium bg-[#00A3FF] rounded-md text-white flex items-center justify-center gap-2 hover:bg-[#0096FF] transition-colors ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSummarize}
          disabled={!videoUrl}
        >
          <Sparkles id="summarize-icon-sparkles" className="w-4 h-4" strokeWidth={2.5} />
          Summarize Now
        </button>
      </div>
    </section>
  );
};

export default SummarizeVideoSection;