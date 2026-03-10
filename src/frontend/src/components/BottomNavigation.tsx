import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bug,
  Calendar,
  FileText,
  Gamepad2,
  Home,
  MessageSquare,
  Scissors,
  Shield,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useGetOwnRole } from "../hooks/useGetOwnRole";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getCustomRole } from "../utils/customRoles";
import FeedbackModal from "./FeedbackModal";

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
    label: "Home",
    icon: Home,
    roles: USER_ROLES,
  },
  {
    path: "/clips",
    label: "Clips",
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
    path: "/profile",
    label: "Profile",
    icon: User,
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
    label: "Collab",
    icon: Users,
    roles: USER_ROLES,
  },
  {
    path: "/game",
    label: "Games",
    icon: Gamepad2,
    roles: USER_ROLES,
  },
  {
    path: "/scheduler",
    label: "Schedule",
    icon: Calendar,
    roles: USER_ROLES,
  },
  {
    path: "/content-manager",
    label: "Content",
    icon: FileText,
    roles: ["owner", "admin"],
  },
  { path: "/admin", label: "Admin", icon: Shield, roles: ["owner", "admin"] },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: ownRole } = useGetOwnRole();
  const { identity } = useInternetIdentity();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const isAuthenticated = !!identity;

  const roleStr = ownRole
    ? typeof ownRole === "object"
      ? Object.keys(ownRole)[0]
      : String(ownRole)
    : null;

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const customRole = principalStr ? getCustomRole(principalStr) : null;
  const effectiveRole = customRole ?? roleStr;

  const filteredItems = navItems.filter((item) => {
    if (!effectiveRole) return item.roles.includes("user");
    return item.roles.includes(effectiveRole);
  });

  // Show max 4 nav items + feedback button on mobile
  const displayItems = filteredItems.slice(0, 4);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-primary/10 px-2 py-2">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {displayItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate({ to: item.path })}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                <div
                  className={`p-1.5 rounded-lg transition-all duration-200 ${active ? "bg-primary/20 neon-glow-sm" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">
                  {item.label}
                </span>
                {active && <div className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}

          {/* Report a Bug / Feature button */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] text-muted-foreground hover:text-primary"
              data-ocid="nav.button"
            >
              <div className="p-1.5 rounded-lg">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">
                Feedback
              </span>
            </button>
          )}
        </div>
      </nav>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
