import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminPasswordAuth } from '../hooks/useAdminPasswordAuth';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminPasswordInput() {
  const [password, setPassword] = useState('');
  const { validatePassword, isValidating, error } = useAdminPasswordAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validatePassword(password);
    
    if (isValid) {
      setShowSuccess(true);
      setPassword('');
      // Navigate to admin panel after a brief success message
      setTimeout(() => {
        navigate({ to: '/admin' });
      }, 500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isValidating}
            className="pl-9 w-48"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isValidating || !password.trim()}
          variant="outline"
          size="sm"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : showSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Valid
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="absolute top-full mt-2 right-0 w-96 z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
