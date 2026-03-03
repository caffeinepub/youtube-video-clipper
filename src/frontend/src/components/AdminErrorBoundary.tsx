import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home } from "lucide-react";
import type React from "react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("═══════════════════════════════════════════════════════");
    console.error("[AdminErrorBoundary] Caught error in admin panel:");
    console.error("[AdminErrorBoundary] Error:", error);
    console.error("[AdminErrorBoundary] Error message:", error.message);
    console.error("[AdminErrorBoundary] Error stack:", error.stack);
    console.error(
      "[AdminErrorBoundary] Component stack:",
      errorInfo.componentStack,
    );
    console.error("═══════════════════════════════════════════════════════");

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-6 h-6" />
                <CardTitle>Admin Panel Error</CardTitle>
              </div>
              <CardDescription>
                Something went wrong while loading the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Error Message:
                </p>
                <p className="text-sm font-mono text-destructive break-all">
                  {this.state.error?.message || "Unknown error occurred"}
                </p>
              </div>

              {this.state.error?.stack && (
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Stack Trace:
                  </p>
                  <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              {this.state.errorInfo?.componentStack && (
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Component Stack:
                  </p>
                  <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-48">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: null,
                      errorInfo: null,
                    })
                  }
                  variant="default"
                >
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
