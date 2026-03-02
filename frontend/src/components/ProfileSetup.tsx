import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserRole } from '../backend';
import type { UserProfile } from '../types/app';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        name: name.trim(),
        role: UserRole.user,
        status: 'active',
      };
      await saveProfile.mutateAsync(profile);
      onComplete();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full border border-cyan-neon/30">
        <h2 className="font-orbitron text-lg text-cyan-neon mb-2">SETUP PROFILE</h2>
        <p className="text-muted-foreground text-sm mb-6">Enter your gamer tag to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your gamer tag..."
              className="w-full px-3 py-2 rounded-lg bg-purple-deep/50 border border-cyan-neon/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-neon transition-smooth"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full py-2 rounded-lg cyberpunk-btn transition-smooth text-sm font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Start Gaming'}
          </button>
        </form>
      </div>
    </div>
  );
}
