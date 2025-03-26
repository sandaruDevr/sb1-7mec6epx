import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { useAuth } from "../auth/AuthContext";
import { getSummaryStats } from "../lib/database";

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalSummaries: 0,
    totalTimeSaved: 0,
    mostSummarizedTopic: 'AI & Tech',
    maxVideoLength: '0:00'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const fetchedStats = await getSummaryStats(user.uid);
        setStats(fetchedStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      icon: "file",
      value: loading ? "..." : stats.totalSummaries.toString(),
      label: "Total Summaries Created",
    },
    {
      icon: "clock",
      value: loading ? "..." : `${stats.totalTimeSaved} hrs`,
      label: "Total Time Saved",
    },
    {
      icon: "chart-bar",
      value: loading ? "..." : stats.mostSummarizedTopic,
      label: "Most Summarized Topic",
    },
    {
      icon: "video",
      value: loading ? "..." : stats.maxVideoLength,
      label: "Max Video Length",
    },
  ];

  return (
    <section className="mb-6 md:mb-8">
      <h2 className="mb-2 text-base font-semibold text-slate-900">
        Your Summary Stats
      </h2>
      {loading ? (
        <div className="h-[100px] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats.totalSummaries === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          You haven't summarized any videos yet. Hit 'Summarize New Video' to get started!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StatsSection;