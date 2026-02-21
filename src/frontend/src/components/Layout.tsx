import { SiYoutube } from 'react-icons/si';
import { Scissors, Shield, LogIn, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link, useLocation } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import AdminPasswordInput from './AdminPasswordInput';
import { useAdminPasswordAuth } from '../hooks/useAdminPasswordAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'youtube-clipper'
  );
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { isValidated, clearValidation } = useAdminPasswordAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      clearValidation(); // Clear password validation on logout
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('[Layout] Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2 text-primary">
                <SiYoutube className="w-8 h-8" />
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Beast Clipping</h1>
                <p className="text-sm text-muted-foreground">Create and save YouTube video clips</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Admin password input - shown for authenticated users who haven't validated yet */}
              {isAuthenticated && !isValidated && (
                <AdminPasswordInput />
              )}

              {/* Admin panel button - shown only after password validation */}
              {isAuthenticated && isValidated && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'bg-primary/10 text-primary hover:bg-primary/20 border-2 border-primary/30'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              {/* Login/Logout button */}
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} Beast Clipping. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
