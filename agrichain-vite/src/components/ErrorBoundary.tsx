import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AgriChain ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F8F4] flex items-center justify-center p-4 font-sans text-[#1B4332]">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#D5E5D8] shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-black text-xl text-[#1B4332]">
                Something went wrong
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                AgriChain encountered an unexpected error while loading. Please refresh or reset app state.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Error Details:
                </span>
                <p className="text-[11px] font-mono text-rose-700 font-semibold break-all leading-snug">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#1B4332] hover:bg-[#122e22] text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>Reload App</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-emerald-700" />
                <span>Reset &amp; Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
