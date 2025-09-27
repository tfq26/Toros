import React from 'react';
import { useError } from '@/contexts/ErrorContext';
import ErrorPage from '@/pages/Error';

/**
 * ErrorBoundary component that wraps the application to catch errors
 * and display the ErrorPage with proper context
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorPage 
          error={this.state.error} 
          onRetry={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook that provides error boundary functionality with context
 */
const useErrorBoundary = () => {
  const { setError } = useError?.() || {};
  
  const withErrorBoundary = (Component) => {
    return (props) => (
      <ErrorBoundary onReset={() => setError?.(null)}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  return { ErrorBoundary, withErrorBoundary };
};

export { ErrorBoundary, useErrorBoundary };
export default ErrorBoundary;
