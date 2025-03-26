import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getRecentSummaries, StoredSummary } from "../lib/database";

const RecentSummaries: React.FC = () => {
  const [summaries, setSummaries] = useState<StoredSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedSummaries = await getRecentSummaries(user.uid, 3);
        setSummaries(fetchedSummaries);
      } catch (err) {
        console.error('Error fetching recent summaries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [user]);

  const handleViewSummary = (summary: StoredSummary) => {
    navigate(`/new?url=https://www.youtube.com/watch?v=${summary.videoId}`, {
      state: { storedSummary: summary }
    });
  };

  const handleSeeMore = () => {
    navigate('/history');
  };

  if (loading) {
    return (
      <section id="recent-summaries-section" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 id="recent-summaries-title" className="text-base font-semibold text-slate-900">
            Recent Summaries
          </h2>
        </div>
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (summaries.length === 0) {
    return (
      <section id="recent-summaries-section" className="mb-8">
        <h2 id="recent-summaries-title" className="mb-2 text-base font-semibold text-slate-900">
          Recent Summaries
        </h2>
        <div id="recent-summaries-empty" className="p-4 text-sm text-slate-500 bg-white rounded-lg">
          You haven't summarized any videos yet. Hit 'Summarize New Video' to get started!
        </div>
      </section>
    );
  }

  return (
    <section id="recent-summaries-section" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 id="recent-summaries-title" className="text-base font-semibold text-slate-900">
          Recent Summaries
        </h2>
        <button
          onClick={handleSeeMore}
          className="flex items-center gap-1 text-sm font-medium text-[#00A3FF] hover:text-[#0096FF] transition-colors"
        >
          See All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaries.map((summary) => (
          <div
            key={summary.id}
            className="group bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleViewSummary(summary)}
          >
            <div className="relative aspect-video">
              <img
                src={summary.thumbnail}
                alt={summary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-900 line-clamp-2 mb-2 group-hover:text-[#00A3FF] transition-colors">
                {summary.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{summary.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentSummaries;