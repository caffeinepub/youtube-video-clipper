import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import VideoUrlForm from './components/VideoUrlForm';
import YouTubePlayer from './components/YouTubePlayer';
import ClipTimestampControls from './components/ClipTimestampControls';
import ClipList from './components/ClipList';
import { Toaster } from '@/components/ui/sonner';
import type { Clip } from './backend';

function AppContent() {
  const [videoId, setVideoId] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  const handleVideoSubmit = (url: string, id: string) => {
    setVideoUrl(url);
    setVideoId(id);
    setSelectedClip(null);
  };

  const handleClipSelect = (clip: Clip) => {
    setSelectedClip(clip);
    // Extract video ID from the clip's video URL
    const urlMatch = clip.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (urlMatch) {
      setVideoId(urlMatch[1]);
      setVideoUrl(clip.videoUrl);
    }
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
                />
              </>
            )}
          </div>

          {/* Sidebar - Clip List */}
          <div className="lg:col-span-1">
            <ClipList onClipSelect={handleClipSelect} selectedClipId={selectedClip?.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
