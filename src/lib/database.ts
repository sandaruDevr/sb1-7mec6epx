import { ref, set, get, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from './firebase';

export interface StoredSummary {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  summary: {
    sections: Array<{
      timestamp: string;
      title: string;
      description: string;
      topics: Array<{
        title: string;
        points: string[];
      }>;
    }>;
  };
  mindMap?: {
    id: string;
    label: string;
    children: any[];
  };
  createdAt: number;
  userId: string;
}

export interface SaveSummaryData {
  userId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  summary: any;
  mindMap?: any;
}

export const saveSummary = async (data: SaveSummaryData): Promise<void> => {
  if (!data.userId) {
    throw new Error('User ID is required to save summary');
  }

  const summaryData: StoredSummary = {
    id: `${data.videoId}-${Date.now()}`,
    videoId: data.videoId,
    title: data.title,
    thumbnail: data.thumbnail,
    duration: data.duration,
    summary: data.summary,
    ...(data.mindMap && { mindMap: data.mindMap }),
    createdAt: Date.now(),
    userId: data.userId
  };

  const summaryRef = ref(database, `summaries/${data.userId}/${summaryData.id}`);
  await set(summaryRef, summaryData);
};

export const updateSummaryMindMap = async (
  userId: string,
  summaryId: string,
  mindMap: any
): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required to update mind map');
  }

  const summaryRef = ref(database, `summaries/${userId}/${summaryId}/mindMap`);
  await set(summaryRef, mindMap);
};

export const getRecentSummaries = async (userId: string, limit: number = 5): Promise<StoredSummary[]> => {
  if (!userId) {
    throw new Error('User ID is required to fetch summaries');
  }

  const summariesRef = ref(database, `summaries/${userId}`);
  const summariesQuery = query(summariesRef, orderByChild('createdAt'), limitToLast(limit));
  
  const snapshot = await get(summariesQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const summaries: StoredSummary[] = [];
  snapshot.forEach((childSnapshot) => {
    summaries.unshift(childSnapshot.val());
  });

  return summaries;
};

const parseDuration = (duration: string): number => {
  const parts = duration.split(':').map(Number);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    [seconds] = parts;
  }

  return (hours * 3600) + (minutes * 60) + seconds;
};

export const getSummaryStats = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required to fetch summary stats');
  }

  const summariesRef = ref(database, `summaries/${userId}`);
  const snapshot = await get(summariesRef);
  
  if (!snapshot.exists()) {
    return {
      totalSummaries: 0,
      totalTimeSaved: 0,
      mostSummarizedTopic: 'N/A',
      maxVideoLength: '0:00'
    };
  }

  const summaries = Object.values(snapshot.val()) as StoredSummary[];
  
  // Calculate total time in seconds
  let totalSeconds = 0;
  let maxDurationSeconds = 0;
  let maxDuration = '0:00';

  summaries.forEach(summary => {
    const durationSeconds = parseDuration(summary.duration);
    totalSeconds += durationSeconds;
    
    if (durationSeconds > maxDurationSeconds) {
      maxDurationSeconds = durationSeconds;
      maxDuration = summary.duration;
    }
  });

  // Convert total seconds to hours (rounded down)
  const totalHours = Math.floor(totalSeconds / 3600);

  // Most summarized topic (based on first section title of each summary)
  const topicCount: Record<string, number> = {};
  summaries.forEach(summary => {
    const topic = summary.summary.sections[0]?.title || 'Other';
    topicCount[topic] = (topicCount[topic] || 0) + 1;
  });

  const mostSummarizedTopic = Object.entries(topicCount)
    .reduce((max, [topic, count]) => 
      count > (max[1] || 0) ? [topic, count] : max, ['N/A', 0])[0];

  return {
    totalSummaries: summaries.length,
    totalTimeSaved: totalHours,
    mostSummarizedTopic,
    maxVideoLength: maxDuration
  };
};