import { VideoMetadata, TranscriptResponse, VideoSummary, SuggestedVideo, MindMapNode } from './types';

const YOUTUBE_API_KEY = 'AIzaSyANo553lipSaJqbeSyTWtfnYHGwBVKM7uE';
const OPENAI_API_KEY = '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';

export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getVideoMetadata = async (videoId: string): Promise<VideoMetadata> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  const video = data.items[0];

  const duration = video.contentDetails.duration
    .replace('PT', '')
    .replace('H', ':')
    .replace('M', ':')
    .replace('S', '');

  return {
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
    duration,
  };
};

const generateSearchKeyword = async (title: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that extracts the most meaningful search keywords from video titles. Return only the keywords, no explanation or additional text.'
          },
          {
            role: 'user',
            content: `Extract the most meaningful search keywords from this video title: "${title}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return title;
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating search keyword:', error);
    return title;
  }
};

export const getSuggestedVideos = async (
  videoId: string, 
  videoTitle: string, 
  maxResults: number = 5
): Promise<SuggestedVideo[]> => {
  try {
    const searchKeyword = await generateSearchKeyword(videoTitle);
    console.log('Generated search keyword:', searchKeyword);

    // Request more videos than needed to account for filtering
    const requestCount = maxResults + 5;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchKeyword)}&type=video&maxResults=${requestCount}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.warn('No videos found or invalid response format');
      return [];
    }

    // Filter out the current video
    const filteredItems = data.items.filter(item => item.id.videoId !== videoId);

    // Get video details including statistics for all filtered videos
    const videoIds = filteredItems.map((item: any) => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const detailsData = await detailsResponse.json();

    if (!detailsData.items || !Array.isArray(detailsData.items)) {
      console.warn('No video details found or invalid response format');
      return [];
    }

    // Create full video objects with all details
    const videosWithStats = detailsData.items.map(item => {
      const duration = (item.contentDetails.duration || 'PT0S')
        .replace('PT', '')
        .replace('H', ':')
        .replace('M', ':')
        .replace('S', '');

      const viewCount = Number(item.statistics.viewCount || 0);
      const formattedViewCount = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(viewCount);

      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration,
        channelTitle: item.snippet.channelTitle,
        viewCount: formattedViewCount,
        rawViewCount: viewCount,
        publishedAt: item.snippet.publishedAt,
      };
    });

    // Sort by view count (descending) and take exactly maxResults videos
    const sortedVideos = videosWithStats
      .sort((a, b) => b.rawViewCount - a.rawViewCount)
      .slice(0, maxResults);

    return sortedVideos.map(({ rawViewCount, ...video }) => video);
  } catch (error) {
    console.error('Error fetching suggested videos:', error);
    return [];
  }
};

export const getTranscript = async (videoId: string): Promise<TranscriptResponse> => {
  try {
    const params = new URLSearchParams({
      engine: 'youtube_transcripts',
      video_id: videoId,
      api_key: 'oX32cYUe8DNj3rZsmeNS9jjk',
    });

    const response = await fetch(`https://www.searchapi.io/api/v1/search?${params.toString()}`);
    const data = await response.json();

    if (!data || !data.transcripts || !Array.isArray(data.transcripts)) {
      throw new Error('No transcript available for this video');
    }

    if (data.transcripts.length === 0) {
      throw new Error('This video has no transcript available');
    }

    return data;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch video transcript. Please ensure the video has captions available.');
  }
};

export const generateSummary = async (transcript: string): Promise<VideoSummary> => {
  try {
    console.log('Sending request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {
            role: 'system',
            content: `You are an expert assistant that creates comprehensive and structured summaries of video transcripts.Adapt the structure and tone based on the video type (tutorial, lecture, podcast, news, etc.), providing clear,detaild and accurate insights. Your task is to analyze the transcript and return a response in the following specific JSON format:

{
  "sections": [
    {
      "timestamp": "MM:SS", // include exact timestamps in transcript
      "title": "Section Title",
      "description": "A clear and concise overview of this section's main points",
      "topics": [
        {
          "title": "Topic Title",  use more Topics as you want to build better sammary
          "points": [
            "Key point 1 with specific details",
            "Key point 2 with specific details" // use more key points as you want
          ]
        }
      ]
    }
  ]
}

Important guidelines:
1. use more sections and according to complexity and transcript legnth.
2. Provide a detailed summary that ensures the reader fully understands all concepts covered in the video without needing to watch it

Important guidelines:
1. Ensure strict JSON format compliance. do not use any unwant backticks symbols in json respond.
2. Use descriptive titles for sections and topics
3. Include relevant and 100% accurate timestamps for each section
4. Provide detailed points that capture both explicit and implicit insights
5. Create as many sections,topics and Key points as needed for comprehensive coverage
6. Focus on accuracy and clarity in all descriptions and points
7. Last section must be conclusion which is final thoughts of entire video`
          },
          {
            role: 'user',
            content: `Analyze and summarize this transcript in the specified JSON format. ensure to cover all the concepts and information in transcript :
            
            ${transcript}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI API Response Status:', response.status);
    
    const data = await response.json();
    console.log('OpenAI API Response:', data);
    
    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      throw new Error(`OpenAI API Error: ${data.error.message || 'Unknown error'}`);
    }
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI API Response Structure:', data);
      throw new Error('Invalid response structure from OpenAI API');
    }

    try {
      const summaryContent = JSON.parse(data.choices[0].message.content);
      
      if (!summaryContent.sections || !Array.isArray(summaryContent.sections)) {
        console.error('Invalid Summary Format:', summaryContent);
        throw new Error('Invalid summary format');
      }

      return summaryContent;
    } catch (parseError) {
      console.error('Failed to Parse OpenAI Response:', parseError);
      console.error('Response Content:', data.choices[0].message.content);
      throw new Error('Failed to parse summary response');
    }
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
};

export const generateMindMap = async (summary: VideoSummary): Promise<MindMapNode> => {
  try {
    const summaryText = JSON.stringify(summary);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating hierarchical mind maps from video summaries. Create a mind map that:
              1. Extracts core concepts and their relationships
              2. Creates a clear hierarchy of ideas
              3. Uses concise, meaningful labels
              4. Maintains logical grouping of related concepts
              5. Limits depth to 3-4 levels for readability
              6. do not use any unwant backticks symbols in json respond
              
              Return the mind map as a JSON object with this structure:
              {
                "id": "root",
                "label": "Main Topic",
                "children": [
                  {
                    "id": "unique-id",
                    "label": "Subtopic",
                    "children": []
                  }
                ]
              }
 example respond:

 {
  "id": "root",
  "label": "How to Bake a Cake",
  "children": [
    {
      "id": "intro",
      "label": "Introduction to Baking",
      "children": [
        {
          "id": "overview",
          "label": "Overview",
          "children": [
            { "id": "intro-1", "label": "Introduction to cake baking for beginners", "children": [] },
            { "id": "intro-2", "label": "Understanding the basic ingredients and tools needed", "children": [] }
          ]
        },
        {
          "id": "why-bake",
          "label": "Why Learn Baking?",
          "children": [
            { "id": "why-1", "label": "Fun and rewarding skill", "children": [] },
            { "id": "why-2", "label": "Homemade cakes are healthier and cost-effective", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "ingredients-tools",
      "label": "Gathering Ingredients & Tools",
      "children": [
        {
          "id": "ingredients",
          "label": "Essential Ingredients",
          "children": [
            { "id": "ing-1", "label": "Flour, sugar, eggs, butter, baking powder, vanilla extract", "children": [] },
            { "id": "ing-2", "label": "Optional ingredients for flavor variations", "children": [] }
          ]
        },
        {
          "id": "tools",
          "label": "Necessary Tools",
          "children": [
            { "id": "tool-1", "label": "Mixing bowls, measuring cups, whisk, oven, cake pan", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "mixing",
      "label": "Mixing & Preparing the Batter",
      "children": [
        {
          "id": "mixing-steps",
          "label": "Step-by-Step Mixing",
          "children": [
            { "id": "mix-1", "label": "Combine dry ingredients separately", "children": [] },
            { "id": "mix-2", "label": "Whisk eggs, sugar, and butter together", "children": [] },
            { "id": "mix-3", "label": "Slowly mix everything into a smooth batter", "children": [] }
          ]
        },
        {
          "id": "prep-pan",
          "label": "Prepping the Cake Pan",
          "children": [
            { "id": "prep-1", "label": "Grease the pan to prevent sticking", "children": [] },
            { "id": "prep-2", "label": "Pour the batter evenly into the pan", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "baking",
      "label": "Baking the Cake",
      "children": [
        {
          "id": "oven-setup",
          "label": "Oven Setup",
          "children": [
            { "id": "oven-1", "label": "Preheat oven to 350°F (175°C)", "children": [] },
            { "id": "oven-2", "label": "Place the pan in the center of the oven", "children": [] }
          ]
        },
        {
          "id": "baking-process",
          "label": "Baking Process",
          "children": [
            { "id": "bake-1", "label": "Bake for 30-35 minutes", "children": [] },
            { "id": "bake-2", "label": "Check doneness using a toothpick", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "decorating",
      "label": "Decorating the Cake",
      "children": [
        {
          "id": "frosting",
          "label": "Frosting & Toppings",
          "children": [
            { "id": "frost-1", "label": "Choose frosting type (buttercream, chocolate, etc.)", "children": [] },
            { "id": "frost-2", "label": "Add fruits, sprinkles, or other decorations", "children": [] }
          ]
        },
        {
          "id": "final-touches",
          "label": "Final Touches",
          "children": [
            { "id": "touch-1", "label": "Smooth frosting evenly", "children": [] },
            { "id": "touch-2", "label": "Let the cake set before serving", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "conclusion",
      "label": "Conclusion & Tips",
      "children": [
        {
          "id": "final-thoughts",
          "label": "Final Thoughts",
          "children": [
            { "id": "final-1", "label": "Practice makes perfect", "children": [] },
            { "id": "final-2", "label": "Experiment with flavors and designs", "children": [] }
          ]
        },
        {
          "id": "common-mistakes",
          "label": "Common Mistakes to Avoid",
          "children": [
            { "id": "mistake-1", "label": "Overmixing the batter", "children": [] },
            { "id": "mistake-2", "label": "Not preheating the oven", "children": [] },
            { "id": "mistake-3", "label": "Removing the cake from the pan too early", "children": [] }
          ]
        }
      ]
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Create a mind map from this video summary: ${summaryText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API Error: ${data.error.message || 'Unknown error'}`);
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating mind map:', error);
    throw error;
  }
};