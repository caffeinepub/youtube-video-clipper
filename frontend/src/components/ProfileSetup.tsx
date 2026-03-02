import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your display name');
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        role: 'user',
        status: 'active',
      });
      toast.success('Profile created! Welcome to Beast Clipping!');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="bg-card border-border max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Zap size={20} />
            Welcome to Beast Clipping!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up your profile to get started. This only takes a moment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <User size={36} className="text-primary/60" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-foreground">Display Name</Label>
            <Input
              id="displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name..."
              className="bg-background border-border text-foreground"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saveProfile.isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Saving...
              </span>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
