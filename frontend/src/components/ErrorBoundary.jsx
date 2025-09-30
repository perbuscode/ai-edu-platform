// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary capturó un error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-white bg-rose-700">
          <p className="font-semibold">
            Se produjo un error al renderizar la UI.
          </p>
          <pre className="mt-2 whitespace-pre-wrap">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
