import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import VideoUrlForm from './components/VideoUrlForm';
import YouTubePlayer from './components/YouTubePlayer';
import ClipTimestampControls from './components/ClipTimestampControls';
import ClipList from './components/ClipList';
import ClipSuggestions from './components/ClipSuggestions';
import { Toaster } from '@/components/ui/sonner';
import type { Clip } from './backend';

const queryClient = new QueryClient();

function AppContent() {
  const [videoId, setVideoId] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [suggestedClip, setSuggestedClip] = useState<{
    startTime: number;
    endTime: number;
    title: string;
  } | null>(null);

  const handleVideoSubmit = (url: string, id: string) => {
    setVideoUrl(url);
    setVideoId(id);
    setSelectedClip(null);
    setSuggestedClip(null);
  };

  const handleClipSelect = (clip: Clip) => {
    setSelectedClip(clip);
    setSuggestedClip(null);
    // Extract video ID from the clip's video URL
    const urlMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (urlMatch) {
      setVideoId(urlMatch[1]);
      setVideoUrl(clip.videoUrl);
    }
  };

  const handleSuggestionSelect = (startTime: number, endTime: number, title: string) => {
    setSuggestedClip({ startTime, endTime, title });
    setSelectedClip(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <VideoUrlForm onSubmit={handleVideoSubmit} />
            
            {videoId && (
              <>
                <YouTubePlayer videoId={videoId} />
                <ClipTimestampControls 
                  videoUrl={videoUrl}
                  videoId={videoId}
                  selectedClip={selectedClip}
                  suggestedStartTime={suggestedClip?.startTime}
                  suggestedEndTime={suggestedClip?.endTime}
                  suggestedTitle={suggestedClip?.title}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ClipSuggestions onSelectSuggestion={handleSuggestionSelect} />
            <ClipList onClipSelect={handleClipSelect} selectedClipId={selectedClip?.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
