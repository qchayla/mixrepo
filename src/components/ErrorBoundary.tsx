import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="glass rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-destructive" />
            </div>
            <h2 className="text-lg font-bold font-display mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              An unexpected error occurred. You can try again or go back to the home page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-xs text-left bg-secondary rounded-lg p-3 mb-4 overflow-auto max-h-32 text-muted-foreground">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-sm font-semibold active:scale-95 transition-transform"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary to-electric text-primary-foreground text-sm font-semibold active:scale-95 transition-transform glow-primary"
              >
                <Home size={14} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
