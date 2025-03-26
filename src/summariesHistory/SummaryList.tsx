import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Eye } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getRecentSummaries } from '../lib/database';
import { StoredSummary } from '../lib/database';

const SummaryList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [summaries, setSummaries] = useState<StoredSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedSummaries = await getRecentSummaries(user.uid);
        // Sort by createdAt in descending order (newest first)
        const sortedSummaries = fetchedSummaries.sort((a, b) => b.createdAt - a.createdAt);
        setSummaries(sortedSummaries);
      } catch (err) {
        console.error('Error fetching summaries:', err);
        setError('Failed to load summaries');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [user]);

  const handleViewSummary = (summary: StoredSummary) => {
    // Navigate to the new summary page with the stored summary data
    navigate(`/new?url=https://www.youtube.com/watch?v=${summary.videoId}`, {
      state: { storedSummary: summary }
    });
  };

  const filteredSummaries = summaries.filter(summary =>
    summary.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div id="summaries-list-container">
      <div id="summaries-list-search" className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recent summarized videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {filteredSummaries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No summaries found. Start by summarizing a video!
        </div>
      ) : (
        <div id="summaries-list-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSummaries.map((summary) => (
            <div
              key={summary.id}
              id={`summary-card-${summary.id}`}
              className="flex flex-col p-[10px] gap-[15px] rounded-[10px] border-[0.5px] border-[#E1E1E1] bg-white hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full">
                <img
                  src={summary.thumbnail}
                  alt={summary.title}
                  className="w-full h-[200px] object-cover rounded-[5px]"
                />
              </div>
              <div className="flex flex-col gap-[15px]">
                <h3 className="text-[15px] font-medium text-black leading-[22px] line-clamp-2">
                  {summary.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-[#E5F3FF] px-2 py-1 rounded-[4px]">
                    <Clock className="w-3.5 h-3.5 text-[#00A3FF]" />
                    <span className="text-xs text-[#00A3FF]">Duration {summary.duration}</span>
                  </div>
                  <button 
                    onClick={() => handleViewSummary(summary)}
                    className="flex items-center gap-1.5 text-[#00A3FF] text-xs font-medium hover:text-[#0096FF] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Created {new Date(summary.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryList;