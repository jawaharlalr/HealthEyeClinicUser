import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[350px] p-8 m-4 bg-slate-900/60 border border-slate-800 rounded-3xl text-center backdrop-blur-md text-white shadow-xl">
          <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle size={28} />
          </div>

          <h3 className="text-lg font-black text-white mb-2">
            Unable to load this section
          </h3>
          <p className="text-xs font-medium text-slate-400 max-w-sm mb-6 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this page component."}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-teal-400 transition-colors cursor-pointer"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <Home size={15} />
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
