import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAdminStats } from '../hooks/useAdminStats';
import { BarChart3, TrendingUp, Video, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Bug } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import AdminDebugPanel from './AdminDebugPanel';
import AdminManagement from './AdminManagement';
import { useState } from 'react';

export default function AdminPanel() {
  const { totalClips, trendingAnalytics, isLoading, error } = useAdminStats();
  const queryClient = useQueryClient();
  const [debugOpen, setDebugOpen] = useState(true);

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['adminStats'] });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Admin Panel</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>Failed to load admin statistics. Please try again.</p>
            <p className="text-xs font-mono">{error instanceof Error ? error.message : String(error)}</p>
            <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage and monitor your Beast Clipping platform</p>
      </div>

      {/* Debug Panel - Collapsible */}
      <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Authentication Debug Panel
            </span>
            {debugOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <AdminDebugPanel />
        </CollapsibleContent>
      </Collapsible>

      {/* Admin Management Section */}
      <AdminManagement />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clips</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClips ? Number(totalClips) : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All saved video clips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Clips</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendingAnalytics?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Top performing clips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">System monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Clips Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Clips Analytics</CardTitle>
          <CardDescription>Top performing clips ranked by engagement score</CardDescription>
        </CardHeader>
        <CardContent>
          {trendingAnalytics && trendingAnalytics.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Trending Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingAnalytics.map((clip, index) => (
                    <TableRow key={clip.id}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell className="max-w-md truncate">{clip.title}</TableCell>
                      <TableCell className="text-right">{clip.scoreMetrics.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {clip.trendingScore.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trending clips data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
