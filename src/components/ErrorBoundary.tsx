"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Store error info for display
    this.setState({ errorInfo });

    // Log to external service in production (future: Sentry)
    if (process.env.NODE_ENV === "production") {
      // Example: logErrorToService(error, errorInfo);
      console.log("Production error logged:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">
              An unexpected error occurred. Please try again.
            </p>

            {/* Error message preview */}
            {this.state.error && (
              <div className="text-xs text-left bg-muted p-3 rounded-lg mb-4">
                <strong>Error:</strong> {this.state.error.message}
              </div>
            )}

            {/* Expandable error details in dev mode */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-4 bg-muted/50 rounded-lg">
                <summary className="cursor-pointer p-3 font-semibold text-sm hover:bg-muted transition-colors rounded-lg">
                  🔍 Error Details (Dev Mode)
                </summary>
                <div className="p-3 space-y-3">
                  {/* Stack trace */}
                  <div>
                    <div className="font-semibold text-xs mb-1">Stack Trace:</div>
                    <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-48 border border-border">
                      {this.state.error.stack}
                    </pre>
                  </div>

                  {/* Component stack */}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <div className="font-semibold text-xs mb-1">Component Stack:</div>
                      <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-32 border border-border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
