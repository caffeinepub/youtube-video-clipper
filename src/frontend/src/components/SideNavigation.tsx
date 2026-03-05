import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bug,
  Calendar,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Scissors,
  Shield,
  Sun,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import type { UserRole } from "../backend";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { getCustomRole } from "../utils/customRoles";
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
    path: "/messages",
    label: "Messages",
    icon: MessageSquare,
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
];

export default function SideNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ownRole } = useGetOwnRole();
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

  // Check for display-only custom role
  const principalStr = identity?.getPrincipal().toString() ?? "";
  const customRole = principalStr ? getCustomRole(principalStr) : null;
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
      <aside className="w-64 h-screen flex flex-col bg-white/3 backdrop-blur-xl border-r border-primary/10 sticky top-0">
        {/* Logo + controls */}
        <div className="p-6 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-foreground text-lg leading-none">
                Beast
              </h1>
              <p className="text-primary text-xs font-medium tracking-wider uppercase neon-text">
                Clipping
              </p>
            </div>
            <div className="flex items-center gap-1">
              {/* Notification Bell */}
              {isAuthenticated && <NotificationBell />}
              {/* Dark/Light toggle */}
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
          <div className="p-4 border-b border-primary/10">
            <div className="cyber-card p-3 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-10 h-10 ring-2 ring-primary/40">
                  {profilePicUrl && (
                    <AvatarImage src={profilePicUrl} alt={userName} />
                  )}
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate">
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
              <p className="text-muted-foreground text-xs">
                {greeting},{" "}
                <span className="text-primary font-medium">
                  {userName.split(" ")[0]}
                </span>{" "}
                👋
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
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
                    ? "bg-primary/15 text-primary border border-primary/30 neon-glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                data-ocid="nav.link"
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`}
                />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary/10 space-y-2">
          {/* Donate Button */}
          {isAuthenticated && <DonateButton isOwner={isOwner} />}

          {/* Report a Bug / Request a Feature */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
              data-ocid="nav.button"
            >
              <Bug className="w-4 h-4" />
              Report a Bug / Feature
            </button>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              data-ocid="nav.button"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
          <p className="text-center text-xs text-muted-foreground/50 pt-1">
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
