import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Clock, Loader2, TrendingUp } from 'lucide-react';
import { useTrendingClips } from '../hooks/useTrendingClips';
import ViralScoreBadge from './ViralScoreBadge';

interface ClipSuggestionsProps {
  onSelectSuggestion: (startTime: number, endTime: number, title: string) => void;
}

export default function ClipSuggestions({ onSelectSuggestion }: ClipSuggestionsProps) {
  const { data: suggestions, isLoading } = useTrendingClips();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Viral Clip Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered clips ranked by viral potential
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !suggestions || suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No suggestions yet</p>
            <p className="text-xs mt-1">Create some clips to see viral suggestions</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {suggestions.map((clip) => {
                const startTime = Number(clip.startTime);
                const endTime = Number(clip.endTime);
                const duration = endTime - startTime;

                return (
                  <div
                    key={clip.id}
                    className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {clip.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
                          <span>({duration}s)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <ViralScoreBadge score={Math.round(clip.score)} showLabel={false} size="sm" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectSuggestion(startTime, endTime, clip.title)}
                        className="text-xs"
                      >
                        Use This Clip
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
