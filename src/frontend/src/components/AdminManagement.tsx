import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAddAdmin } from "../hooks/useAddAdmin";
import AdminList from "./AdminList";

export default function AdminManagement() {
  const [userId, setUserId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate: addAdmin, isPending, error } = useAddAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      return;
    }

    addAdmin(userId.trim(), {
      onSuccess: () => {
        setSuccessMessage("Admin added successfully!");
        setUserId("");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
          <CardDescription>
            Grant admin access to a user by entering their full Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Principal ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter full principal ID (e.g., 2vxsx-fae...)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isPending}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Note: You must enter the full Principal ID, not the short User
                ID displayed in the header.
              </p>
            </div>

            {successMessage && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to add admin"}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isPending || !userId.trim()}
              className="w-full"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Adding Admin...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AdminList />
    </div>
  );
}
