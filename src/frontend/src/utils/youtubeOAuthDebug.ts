/**
 * Debugging utility for YouTube OAuth flow tracking
 */

export type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class YouTubeOAuthDebugger {
  private logs: LogEntry[] = [];

  log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(entry);

    const prefix = `[YouTubeOAuth:${level.toUpperCase()}]`;

    if (level === "error") {
      console.error(prefix, message, data || "");
    } else if (level === "warn") {
      console.warn(prefix, message, data || "");
    } else {
      console.log(prefix, message, data || "");
    }
  }

  logOAuthInitiation(params: {
    clientId?: string;
    redirectUri?: string;
    scope?: string;
  }) {
    this.log("info", "OAuth flow initiated", params);
  }

  logOAuthCallback(params: {
    accessToken?: string;
    refreshToken?: string;
    channelId?: string;
    channelName?: string;
    expiresAt?: string;
    error?: string;
  }) {
    if (params.error) {
      this.log("error", "OAuth callback received with error", params);
    } else {
      this.log("info", "OAuth callback received successfully", {
        hasAccessToken: !!params.accessToken,
        hasRefreshToken: !!params.refreshToken,
        channelId: params.channelId,
        channelName: params.channelName,
        expiresAt: params.expiresAt,
      });
    }
  }

  logTokenValidation(isValid: boolean, reason?: string) {
    if (isValid) {
      this.log("info", "OAuth token validation passed");
    } else {
      this.log("error", "OAuth token validation failed", { reason });
    }
  }

  logConnectionStatusChange(status: {
    isConnected: boolean;
    channelName?: string;
    channelId?: string;
  }) {
    this.log("info", "Connection status changed", status);
  }

  logBackendCall(method: string, params?: any) {
    this.log("info", `Backend call: ${method}`, params);
  }

  logBackendResponse(method: string, success: boolean, data?: any) {
    if (success) {
      this.log("info", `Backend response: ${method} - SUCCESS`, data);
    } else {
      this.log("error", `Backend response: ${method} - FAILED`, data);
    }
  }

  validateOAuthResponse(response: {
    accessToken?: string;
    refreshToken?: string;
    channelId?: string;
    channelName?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!response.accessToken || response.accessToken.trim() === "") {
      errors.push("Missing or empty access token");
    }

    if (!response.refreshToken || response.refreshToken.trim() === "") {
      errors.push("Missing or empty refresh token");
    }

    if (!response.channelId || response.channelId.trim() === "") {
      errors.push("Missing or empty channel ID");
    }

    if (!response.channelName || response.channelName.trim() === "") {
      errors.push("Missing or empty channel name");
    }

    const isValid = errors.length === 0;

    if (!isValid) {
      this.log("error", "OAuth response validation failed", { errors });
    } else {
      this.log("info", "OAuth response validation passed");
    }

    return { isValid, errors };
  }

  checkCommonErrors(error: any): string {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const commonErrors = [
      {
        pattern: /unauthorized/i,
        suggestion: "User is not authenticated. Please log in first.",
      },
      {
        pattern: /actor not available/i,
        suggestion:
          "Backend actor not initialized. Wait for authentication to complete.",
      },
      {
        pattern: /expired/i,
        suggestion: "OAuth token has expired. Please reconnect your channel.",
      },
      {
        pattern: /invalid.*token/i,
        suggestion: "Invalid OAuth token. Please try connecting again.",
      },
      {
        pattern: /network/i,
        suggestion: "Network error. Check your internet connection.",
      },
    ];

    for (const { pattern, suggestion } of commonErrors) {
      if (pattern.test(errorMessage)) {
        this.log("warn", "Common error detected", { errorMessage, suggestion });
        return suggestion;
      }
    }

    return "An unexpected error occurred. Check console logs for details.";
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.log("info", "Debug logs cleared");
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const youtubeOAuthDebugger = new YouTubeOAuthDebugger();
