import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  DollarSign,
  Gift,
  Link2,
  Rocket,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const QUESTS = [
  { id: 1, title: "Create your first clip", xp: 100, done: true, icon: "✂️" },
  {
    id: 2,
    title: "Connect your YouTube channel",
    xp: 150,
    done: true,
    icon: "📺",
  },
  { id: 3, title: "Add captions to a clip", xp: 75, done: false, icon: "💬" },
  {
    id: 4,
    title: "Share a clip to social media",
    xp: 100,
    done: false,
    icon: "📤",
  },
  { id: 5, title: "Try Hype Detection", xp: 125, done: false, icon: "🔥" },
  { id: 6, title: "Export to TikTok format", xp: 100, done: false, icon: "🎵" },
  {
    id: 7,
    title: "Create 5 clips in one week",
    xp: 200,
    done: false,
    icon: "🎯",
  },
  { id: 8, title: "Get 100 views on a clip", xp: 250, done: false, icon: "👀" },
];

const EARNINGS = [
  { month: "Jan", amount: 12.4 },
  { month: "Feb", amount: 28.9 },
  { month: "Mar", amount: 45.2 },
];

export default function AffiliatePage() {
  const { identity } = useInternetIdentity();
  const [copiedLink, setCopiedLink] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<number[]>(
    QUESTS.filter((q) => q.done).map((q) => q.id),
  );

  const principal = identity?.getPrincipal().toString() ?? "";
  const refCode = principal ? principal.slice(0, 8).toLowerCase() : "xxxxxxxx";
  const referralLink = `https://beastclipping.io/join?ref=${refCode}`;

  const totalXP = QUESTS.filter((q) => completedQuests.includes(q.id)).reduce(
    (s, q) => s + q.xp,
    0,
  );
  const maxXP = QUESTS.reduce((s, q) => s + q.xp, 0);
  const totalEarnings = EARNINGS.reduce((s, e) => s + e.amount, 0);
  const referralCount = 14;
  const convertedCount = 8;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl section-heading tracking-tight flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          Affiliate & Quests
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Earn rewards by referring creators and completing challenges
        </p>
      </div>

      {/* XP Progress */}
      <div className="bg-gradient-to-r from-primary/15 to-purple-500/10 border border-primary/25 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="text-white font-bold">Quest XP</span>
          </div>
          <span className="text-2xl font-black text-primary">
            {totalXP}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              / {maxXP} XP
            </span>
          </span>
        </div>
        <Progress value={(totalXP / maxXP) * 100} className="h-3" />
        <p className="text-xs text-muted-foreground">
          {completedQuests.length}/{QUESTS.length} quests completed ·{" "}
          {maxXP - totalXP} XP to max level
        </p>
      </div>

      {/* Tutorial Quests */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-white font-bold text-base">Tutorial Quests</h2>
        </div>
        <div className="space-y-2">
          {QUESTS.map((q) => {
            const done = completedQuests.includes(q.id);
            return (
              <div
                key={q.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  done
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                data-ocid={`affiliate.quest.item.${q.id}`}
              >
                <span className="text-xl">{q.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${done ? "text-white line-through opacity-60" : "text-white"}`}
                  >
                    {q.title}
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    +{q.xp} XP
                  </p>
                </div>
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCompletedQuests([...completedQuests, q.id]);
                      toast.success(`Quest complete! +${q.xp} XP`);
                    }}
                    className="w-5 h-5 rounded-full border-2 border-white/20 hover:border-primary transition-colors flex-shrink-0"
                    data-ocid="affiliate.quest.button"
                  >
                    <Circle className="w-full h-full text-transparent" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Affiliate Portal */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-yellow-400" />
          <h2 className="text-white font-bold text-base">Affiliate Portal</h2>
        </div>

        {/* Referral Link */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="text-white font-semibold text-sm">
              Your Referral Link
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
            <span className="text-xs text-primary font-mono flex-1 truncate">
              {referralLink}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-primary h-7 w-7 p-0 flex-shrink-0"
              onClick={copyLink}
              data-ocid="affiliate.copy.button"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{referralCount}</p>
            <p className="text-muted-foreground text-xs">Referrals</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{convertedCount}</p>
            <p className="text-muted-foreground text-xs">Converted</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">
              ${totalEarnings.toFixed(0)}
            </p>
            <p className="text-muted-foreground text-xs">Earned</p>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <h3 className="text-white font-semibold text-sm">Monthly Earnings</h3>
          {EARNINGS.map((e) => (
            <div key={e.month} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-8">
                {e.month}
              </span>
              <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(e.amount / 50) * 100}%` }}
                />
              </div>
              <span className="text-xs text-green-400 font-bold w-12 text-right">
                ${e.amount.toFixed(2)}
              </span>
            </div>
          ))}
          <Button
            size="sm"
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 text-xs h-8"
            onClick={() =>
              toast.success(
                "Payout request submitted! Processing in 3-5 business days",
              )
            }
            data-ocid="affiliate.payout.button"
          >
            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
            Request Payout (${totalEarnings.toFixed(2)})
          </Button>
        </div>

        {/* How it works */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
          <h3 className="text-white font-semibold text-sm">How It Works</h3>
          {[
            "Share your referral link with creators",
            "They sign up and start using Beast Clipping",
            "You earn $2 per free signup, $10 per Pro upgrade",
            "Payouts processed monthly via PayPal",
          ].map((step, i) => (
            <div key={step} className="flex items-start gap-2">
              <span className="text-primary text-xs font-bold mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-xs text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/50 pb-4 flex items-center justify-center gap-1">
        Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
