import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDebug } from '../hooks/useAdminDebug';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Copy, CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Shield } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminDebugPanel() {
  const { identity } = useInternetIdentity();
  const { data: debugInfo, isLoading, error, refetch } = useAdminDebug();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const currentPrincipal = identity?.getPrincipal().toString() || 'Not authenticated';

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRefresh = () => {
    console.log('[AdminDebugPanel] Refreshing debug data...');
    queryClient.invalidateQueries({ queryKey: ['adminDebug'] });
    queryClient.invalidateQueries({ queryKey: ['isOwner'] });
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Admin Debug Panel
          </CardTitle>
          <CardDescription>Loading authentication debug information...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            Debug Panel Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load debug information</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="text-xs font-mono mb-2">{error instanceof Error ? error.message : String(error)}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isAdmin = debugInfo?.isAdmin ?? false;
  const adminPrincipals = debugInfo?.adminPrincipals ?? [];
  const hashMapSize = debugInfo?.hashMapSize ?? 0;
  const initStatus = debugInfo?.initializationStatus ?? 'Unknown';

  // Character-by-character comparison helper
  const compareStrings = (str1: string, str2: string) => {
    if (str1 === str2) return { match: true, differences: [] };
    
    const differences: { index: number; char1: string; char2: string }[] = [];
    const maxLen = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const char1 = str1[i] || '(end)';
      const char2 = str2[i] || '(end)';
      if (char1 !== char2) {
        differences.push({ index: i, char1, char2 });
      }
    }
    
    return { match: false, differences };
  };

  const backendMethodMissing = adminPrincipals.length === 0 && hashMapSize === 0 && initStatus.includes('not yet implemented');

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Admin Debug Panel
            </CardTitle>
            <CardDescription>Comprehensive authentication and authorization debugging</CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Backend Implementation Warning */}
        {backendMethodMissing && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Backend Method Missing</AlertTitle>
            <AlertDescription className="text-xs mt-2 space-y-2">
              <p className="font-semibold">The backend does not yet have the <code className="font-mono bg-background/50 px-1 rounded">getAdminDebugInfo()</code> method.</p>
              <p>This method is required to display:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All registered admin principals</li>
                <li>HashMap size and initialization status</li>
                <li>Character-by-character principal comparison</li>
              </ul>
              <p className="mt-2">Currently showing limited debug information using <code className="font-mono bg-background/50 px-1 rounded">isCallerAdmin()</code> only.</p>
            </AlertDescription>
          </Alert>
        )}

        {/* System Status */}
        {!backendMethodMissing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Database className="w-4 h-4" />
                HashMap Size
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <div className="text-2xl font-bold">{hashMapSize}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total admin principals stored
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="w-4 h-4" />
                Initialization Status
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <div className="text-sm font-mono">{initStatus}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Backend initialization state
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current User Principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Your Principal ID</h3>
            <Badge variant={isAdmin ? "default" : "destructive"}>
              {isAdmin ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Admin Access
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  No Admin Access
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
            <code className="flex-1 text-xs font-mono break-all">{currentPrincipal}</code>
            <Button
              onClick={() => copyToClipboard(currentPrincipal, 'current')}
              variant="ghost"
              size="sm"
              className="shrink-0"
            >
              {copiedField === 'current' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Length: {currentPrincipal.length} characters
          </p>
        </div>

        {/* Admin Status Check */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Backend Admin Check Result</h3>
          <div className={`p-4 rounded-lg border-2 ${
            isAdmin 
              ? 'bg-green-50 dark:bg-green-950/20 border-green-500/50' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-500/50'
          }`}>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-900 dark:text-green-100">
                    Backend confirms you are an admin
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-900 dark:text-red-100">
                    Backend says you are NOT an admin
                  </span>
                </>
              )}
            </div>
            <p className="text-xs mt-2 text-muted-foreground">
              Result from calling <code className="font-mono bg-background/50 px-1 rounded">isCallerAdmin()</code>
            </p>
          </div>
        </div>

        {/* Registered Admin Principals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Registered Admin Principals {adminPrincipals.length > 0 && `(${adminPrincipals.length})`}
            </h3>
            {adminPrincipals.length > 0 && hashMapSize !== adminPrincipals.length && (
              <Badge variant="outline" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                Size mismatch: {hashMapSize} in HashMap
              </Badge>
            )}
          </div>
          
          {adminPrincipals.length > 0 ? (
            <div className="space-y-3">
              {adminPrincipals.map((adminPrincipal, index) => {
                const comparison = compareStrings(currentPrincipal, adminPrincipal);
                const isMatch = comparison.match;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className={`p-3 rounded-lg border-2 ${
                      isMatch 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                        : 'bg-background border-border'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Admin #{index + 1}
                        </Badge>
                        {isMatch && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Exact Match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono break-all">{adminPrincipal}</code>
                        <Button
                          onClick={() => copyToClipboard(adminPrincipal, `admin-${index}`)}
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                        >
                          {copiedField === `admin-${index}` ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Length: {adminPrincipal.length} characters
                      </p>
                    </div>
                    
                    {!isMatch && comparison.differences.length > 0 && (
                      <Alert variant={comparison.differences.length < 20 ? "default" : "destructive"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-xs font-semibold">
                          {comparison.differences.length} Character Difference{comparison.differences.length !== 1 ? 's' : ''} Found
                        </AlertTitle>
                        <AlertDescription className="text-xs space-y-2 mt-2">
                          {comparison.differences.length < 20 ? (
                            <>
                              <div className="space-y-1">
                                {comparison.differences.slice(0, 10).map((diff, i) => (
                                  <div key={i} className="font-mono bg-background/50 p-1 rounded">
                                    <span className="text-muted-foreground">Position {diff.index}:</span>{' '}
                                    <span className="bg-red-100 dark:bg-red-900/30 px-1 rounded">'{diff.char1}'</span>
                                    {' vs '}
                                    <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">'{diff.char2}'</span>
                                  </div>
                                ))}
                              </div>
                              {comparison.differences.length > 10 && (
                                <div className="text-muted-foreground italic">
                                  ...and {comparison.differences.length - 10} more differences
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              <p className="font-semibold">Principals are completely different</p>
                              <p className="mt-1">
                                Your principal: {currentPrincipal.length} chars<br />
                                Admin principal: {adminPrincipal.length} chars
                              </p>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Cannot Display Admin Principals</AlertTitle>
              <AlertDescription className="text-xs mt-2 space-y-2">
                {backendMethodMissing ? (
                  <>
                    <p className="font-semibold">Backend method <code className="font-mono bg-background/50 px-1 rounded">getAdminDebugInfo()</code> is not yet implemented.</p>
                    <p>This method is required to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Retrieve all registered admin principals</li>
                      <li>Show HashMap size and initialization status</li>
                      <li>Enable character-by-character comparison</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Current Status:</strong> Can only check if you're an admin, but cannot see who the admins are.
                    </p>
                  </>
                ) : (
                  <>
                    <p>The backend returned an empty list of admin principals.</p>
                    <p className="font-semibold">This indicates a critical issue:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>The admin HashMap may not have been initialized</li>
                      <li>The initialization process may have failed</li>
                      <li>The admin token may not have been properly set</li>
                    </ul>
                    <p className="mt-2">
                      <strong>HashMap Size:</strong> {hashMapSize} (should be at least 1)
                    </p>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Troubleshooting Steps</AlertTitle>
          <AlertDescription className="text-xs space-y-2 mt-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Check browser console for detailed authentication logs</li>
              <li>Verify you're logged in with Internet Identity</li>
              <li>Copy your principal ID and compare it manually with expected admin principal</li>
              <li>Try logging out and logging back in</li>
              <li>Check if the admin token was correctly passed during deployment</li>
              <li>Verify the backend initialization logs in the canister logs</li>
            </ol>
            <div className="mt-3 p-2 bg-background rounded border">
              <p className="font-semibold mb-1">Quick Diagnosis:</p>
              <ul className="space-y-1">
                <li>✓ Your Access: {isAdmin ? '✅ Granted' : '❌ Denied'}</li>
                <li>✓ Backend Method: {backendMethodMissing ? '❌ Not Implemented' : '✅ Available'}</li>
                <li>✓ Principal Length: {currentPrincipal.length} characters</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
