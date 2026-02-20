import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, AlertCircle } from 'lucide-react';
import { useYouTubeValidation } from '../hooks/useYouTubeValidation';

interface VideoUrlFormProps {
  onSubmit: (url: string, videoId: string) => void;
}

export default function VideoUrlForm({ onSubmit }: VideoUrlFormProps) {
  const [url, setUrl] = useState('');
  const { validateUrl, extractVideoId } = useYouTubeValidation();
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Invalid YouTube URL. Please use a valid youtube.com or youtu.be link');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }

    onSubmit(url, videoId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Enter YouTube Video URL
        </CardTitle>
        <CardDescription>
          Paste a YouTube video link to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Load Video</Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
