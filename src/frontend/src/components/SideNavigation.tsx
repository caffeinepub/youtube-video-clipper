import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bug,
  Calendar,
  Compass,
  Crown,
  FileText,
  Gamepad2,
  Gift,
  GitBranch,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Scissors,
  Shield,
  Sparkles,
  Sun,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wand2,
  Youtube,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import type { UserRole } from "../backend";
import { useCustomRolesMap } from "../hooks/useCustomRoles";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import DonateButton from "./DonateButton";
import FeedbackModal from "./FeedbackModal";
import NotificationBell from "./NotificationBell";
import UserRoleBadge from "./UserRoleBadge";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("beastclipping_theme");
      if (stored) return stored === "dark";
    } catch {}
    return true; // default dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
    try {
      localStorage.setItem("beastclipping_theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

const USER_ROLES = [
  "owner",
  "admin",
  "user",
  "friend",
  "tester",
  "mod",
  "helper",
];

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: Home,
    roles: USER_ROLES,
  },
  {
    path: "/clips",
    label: "My Clips",
    icon: Scissors,
    roles: USER_ROLES,
  },
  {
    path: "/trending",
    label: "Trending",
    icon: TrendingUp,
    roles: USER_ROLES,
  },
  {
    path: "/scheduler",
    label: "Scheduler",
    icon: Calendar,
    roles: USER_ROLES,
  },
  {
    path: "/youtube",
    label: "YouTube Studio",
    icon: Youtube,
    roles: USER_ROLES,
  },
  {
    path: "/messages",
    label: "Messages",
    icon: MessageSquare,
    roles: USER_ROLES,
  },
  {
    path: "/collab",
    label: "Collab Finder",
    icon: Users,
    roles: USER_ROLES,
  },
  {
    path: "/game",
    label: "Mini Games",
    icon: Gamepad2,
    roles: USER_ROLES,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: User,
    roles: USER_ROLES,
  },
  {
    path: "/content-manager",
    label: "Content",
    icon: FileText,
    roles: ["owner", "admin"],
  },
  {
    path: "/admin",
    label: "Admin Panel",
    icon: Shield,
    roles: ["owner", "admin"],
  },
  {
    path: "/discover",
    label: "Discover",
    icon: Compass,
    roles: USER_ROLES,
  },
  {
    path: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    roles: USER_ROLES,
  },
  {
    path: "/affiliate",
    label: "Affiliate & Quests",
    icon: Gift,
    roles: USER_ROLES,
  },
  {
    path: "/creative",
    label: "Creative Effects",
    icon: Sparkles,
    roles: USER_ROLES,
  },
  {
    path: "/growth",
    label: "Growth Hub",
    icon: TrendingUp,
    roles: USER_ROLES,
  },
  {
    path: "/pro",
    label: "Pro Features",
    icon: Crown,
    roles: USER_ROLES,
  },
  {
    path: "/community",
    label: "Community Hub",
    icon: Users,
    roles: USER_ROLES,
  },
  {
    path: "/magic",
    label: "Magic & Retention",
    icon: Wand2,
    roles: USER_ROLES,
  },
  {
    path: "/workflow",
    label: "Workflow Tools",
    icon: GitBranch,
    roles: USER_ROLES,
  },
];

export default function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ownRole } = useGetOwnRole();
  const customRolesMap = useCustomRolesMap();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const isAuthenticated = !!identity;
  const greeting = getGreeting();
  const userName = userProfile?.name || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  // Normalize role to string for comparison
  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : null;

  // Check for custom role from backend
  const principalStr = identity?.getPrincipal().toString() ?? "";
  const customRole = principalStr
    ? (customRolesMap[principalStr] ?? null)
    : null;
  const effectiveRole = customRole ?? roleStr;

  const filteredNavItems = navItems.filter((item) => {
    if (!effectiveRole) return item.roles.includes("user");
    return item.roles.includes(effectiveRole);
  });

  const isOwner = roleStr === "owner";
  const isAdmin = roleStr === "admin" || isOwner;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  let profilePicUrl: string | undefined;
  if (userProfile?.profilePicture) {
    profilePicUrl = userProfile.profilePicture.getDirectURL();
  }

  const userRoleEnum: UserRole | null = roleStr ? (roleStr as UserRole) : null;
  // suppress unused isAdmin lint for now (used in future)
  void isAdmin;

  return (
    <>
      <aside
        className="w-64 h-screen flex flex-col sticky top-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(36,0,70,0.18) 0%, rgba(11,14,20,0.95) 40%)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid oklch(0.88 0.17 200 / 0.1)",
        }}
      >
        {/* Logo + controls */}
        <div className="px-5 py-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/35 flex items-center justify-center neon-glow-sm">
                <Zap
                  className="w-5 h-5 text-primary"
                  style={{
                    filter: "drop-shadow(0 0 6px oklch(0.88 0.17 200 / 0.7))",
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-black text-foreground text-base leading-none tracking-tight">
                BEAST
              </h1>
              <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase neon-text leading-tight">
                CLIPPING
              </p>
            </div>
            <div className="flex items-center gap-1">
              {isAuthenticated && <NotificationBell />}
              <button
                type="button"
                onClick={() => setIsDark((d) => !d)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                data-ocid="nav.toggle"
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {isAuthenticated && (
          <div className="px-4 py-3 border-b border-primary/8">
            <div className="cyber-card p-3.5 rounded-xl">
              <div className="flex items-center gap-3 mb-2.5">
                <Avatar
                  className="w-11 h-11 ring-2 ring-primary/35 flex-shrink-0"
                  style={{ boxShadow: "0 0 12px oklch(0.88 0.17 200 / 0.2)" }}
                >
                  {profilePicUrl && (
                    <AvatarImage src={profilePicUrl} alt={userName} />
                  )}
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate leading-tight">
                    {userName}
                  </p>
                  {userRoleEnum && (
                    <UserRoleBadge
                      role={userRoleEnum}
                      customRole={customRole}
                      size="sm"
                    />
                  )}
                </div>
              </div>
              <p className="text-muted-foreground/70 text-xs leading-none">
                {greeting},{" "}
                <span className="text-primary font-semibold">
                  {userName.split(" ")[0]}
                </span>{" "}
                👋
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate({ to: item.path })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-primary border border-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                }`}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.88 0.17 200 / 0.12) 0%, oklch(0.88 0.17 200 / 0.04) 100%)",
                        boxShadow:
                          "0 0 12px oklch(0.88 0.17 200 / 0.15), inset 0 1px 0 oklch(0.88 0.17 200 / 0.1)",
                      }
                    : undefined
                }
                data-ocid="nav.link"
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-all ${active ? "text-primary" : ""}`}
                  style={
                    active
                      ? {
                          filter:
                            "drop-shadow(0 0 4px oklch(0.88 0.17 200 / 0.6))",
                        }
                      : undefined
                  }
                />
                <span className="flex-1 text-left">{item.label}</span>
                {active && <div className="nav-active-dot ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Footer — gradient fade separation */}
        <div
          className="px-4 pt-4 pb-4 space-y-1.5"
          style={{
            background:
              "linear-gradient(to top, rgba(11,14,20,0.95) 0%, transparent 100%)",
            borderTop: "1px solid oklch(0.88 0.17 200 / 0.08)",
          }}
        >
          {isAuthenticated && <DonateButton isOwner={isOwner} />}

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all duration-200"
              data-ocid="nav.button"
            >
              <Bug className="w-3.5 h-3.5 flex-shrink-0" />
              Report a Bug / Feature
            </button>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
              data-ocid="nav.button"
            >
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              Sign Out
            </button>
          )}
          <p className="text-center text-xs text-muted-foreground/40 pt-1">
            © {new Date().getFullYear()}{" "}
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
      </aside>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
