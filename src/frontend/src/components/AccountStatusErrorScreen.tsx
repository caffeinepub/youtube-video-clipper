import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Clock, LogOut } from "lucide-react";
import { UserStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AccountStatusErrorScreenProps {
  status: UserStatus.banned | UserStatus.suspended;
}

export default function AccountStatusErrorScreen({
  status,
}: AccountStatusErrorScreenProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const isBanned = status === UserStatus.banned;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${isBanned ? "bg-destructive/10" : "bg-warning/10"}`}
          >
            {isBanned ? (
              <Ban className="w-10 h-10 text-destructive" />
            ) : (
              <Clock className="w-10 h-10 text-warning" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isBanned ? "Account Banned" : "Account Suspended"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isBanned
              ? "Your account has been permanently banned from Beast Clipping."
              : "Your account has been temporarily suspended from Beast Clipping."}
          </p>
        </div>

        <div
          className={`rounded-lg border p-4 text-sm text-left space-y-2 ${isBanned ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}
        >
          {isBanned ? (
            <>
              <p className="font-medium text-destructive">
                Why was my account banned?
              </p>
              <p className="text-muted-foreground">
                Your account was banned due to a violation of our terms of
                service. This action is permanent and cannot be reversed by
                logging in again.
              </p>
              <p className="text-muted-foreground">
                If you believe this is a mistake, please contact an
                administrator.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-warning">
                Why was my account suspended?
              </p>
              <p className="text-muted-foreground">
                Your account has been temporarily suspended. You will not be
                able to access Beast Clipping until the suspension is lifted by
                an administrator.
              </p>
              <p className="text-muted-foreground">
                Please check back later or contact an administrator for more
                information.
              </p>
            </>
          )}
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 mx-auto"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
