import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Shield } from "lucide-react";
import { useAdminList } from "../hooks/useAdminList";
import { generateShortUserId } from "../utils/userIdGenerator";

export default function AdminList() {
  const { data: adminList, isLoading, error } = useAdminList();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Admins</CardTitle>
          <CardDescription>List of users with admin access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Admins</CardTitle>
          <CardDescription>List of users with admin access</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load admin list:{" "}
              {error instanceof Error ? error.message : String(error)}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Admins</CardTitle>
        <CardDescription>
          {adminList && adminList.length > 0
            ? `${adminList.length} user${adminList.length === 1 ? "" : "s"} with admin access`
            : "No admins found"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {adminList && adminList.length > 0 ? (
          <div className="space-y-2">
            {adminList.map((principalText, index) => {
              const shortId = generateShortUserId(principalText);
              return (
                <div
                  key={principalText}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        Admin #{index + 1}
                      </span>
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {shortId}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-1">
                      {principalText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No admins found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
