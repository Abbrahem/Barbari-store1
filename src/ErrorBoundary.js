import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
          <h1 style={{ marginBottom: 12 }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 12, borderRadius: 8 }}>
            {String(this.state.error)}
          </pre>
          <p>Try refresh the page. If this persists, please share this error with support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
