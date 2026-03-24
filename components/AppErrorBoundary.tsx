"use client";
import React from "react";

export default class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err: any) {
    return { error: err?.message || "Unknown error" };
  }
  componentDidCatch(err: any, info: any) {
    console.error("Client error:", err, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="m-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
        <div className="font-semibold text-red-700">
          Something went wrong on this page.
        </div>
        <div className="mt-1 text-red-700/80">{this.state.error}</div>
        <button
          className="mt-3 rounded-md border px-3 py-1"
          onClick={() => navigator.clipboard.writeText(this.state.error!)}
        >
          Copy error
        </button>
      </div>
    );
  }
}
