import { Badge } from "@/components/ui/badge";
import {
  Crown,
  FlaskConical,
  HelpCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import { UserRole } from "../backend";
import type { CustomRole } from "../utils/customRoles";

interface UserRoleBadgeProps {
  role: UserRole;
  customRole?: CustomRole | null;
  size?: "sm" | "default" | "lg";
}

export default function UserRoleBadge({
  role,
  customRole,
  size = "default",
}: UserRoleBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  };

  // Custom role overrides display (but not backend role)
  if (customRole) {
    const customConfigs: Record<
      CustomRole,
      {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        className: string;
      }
    > = {
      tester: {
        label: "Tester",
        icon: FlaskConical,
        className: "bg-blue-600/80 text-white border-0",
      },
      mod: {
        label: "Mod",
        icon: Shield,
        className: "bg-emerald-600/80 text-white border-0",
      },
      helper: {
        label: "Helper",
        icon: HelpCircle,
        className: "bg-yellow-600/80 text-white border-0",
      },
    };
    const cfg = customConfigs[customRole];
    const Icon = cfg.icon;
    return (
      <Badge
        className={`${cfg.className} ${sizeClasses[size]} flex items-center gap-1.5 font-semibold`}
      >
        <Icon className={iconSizes[size]} />
        <span>{cfg.label}</span>
      </Badge>
    );
  }

  const getRoleConfig = (r: UserRole) => {
    switch (r) {
      case UserRole.owner:
        return {
          label: "Owner",
          icon: Crown,
          className:
            "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg",
        };
      case UserRole.admin:
        return {
          label: "Admin",
          icon: Shield,
          className: "bg-blue-600 text-white border-0 shadow-md",
        };
      case UserRole.user:
        return {
          label: "User",
          icon: User,
          className: "bg-green-600 text-white border-0",
        };
      case UserRole.friend:
        return {
          label: "Friend",
          icon: Users,
          className: "bg-gray-600 text-white border-0",
        };
      default:
        return {
          label: "Unknown",
          icon: User,
          className: "bg-gray-400 text-white border-0",
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1.5 font-semibold`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </Badge>
  );
}
