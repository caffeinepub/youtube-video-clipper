import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';

interface ViralScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export default function ViralScoreBadge({ score, showLabel = true, size = 'default' }: ViralScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  const getIcon = (score: number) => {
    if (score >= 80) return <Flame className="w-3 h-3" />;
    if (score >= 50) return <TrendingUp className="w-3 h-3" />;
    return <Sparkles className="w-3 h-3" />;
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'High Viral Potential';
    if (score >= 50) return 'Medium Viral Potential';
    return 'Low Viral Potential';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getScoreColor(score)} ${sizeClasses[size]} font-medium flex items-center gap-1.5 w-fit`}
    >
      {getIcon(score)}
      <span>{score}%</span>
      {showLabel && size !== 'sm' && (
        <span className="hidden sm:inline">• {getLabel(score)}</span>
      )}
    </Badge>
  );
}
