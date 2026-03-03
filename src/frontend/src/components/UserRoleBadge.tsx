import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User, Users } from "lucide-react";
import { UserRole } from "../backend";

interface UserRoleBadgeProps {
  role: UserRole;
  size?: "sm" | "default" | "lg";
}

export default function UserRoleBadge({
  role,
  size = "default",
}: UserRoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
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

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1.5 font-semibold`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </Badge>
  );
}
