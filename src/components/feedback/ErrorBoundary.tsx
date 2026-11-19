import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught application error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-dvh place-items-center p-4">
          <div className="card max-w-md p-6 text-center">
            <h1 className="text-2xl font-black text-rose-600 dark:text-rose-400">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink-soft dark:text-slate-400">
              Your local progress on this device is safe. Reload the app to continue.
            </p>
            <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-slate-100 p-3 text-left text-xs text-slate-700 dark:bg-night dark:text-slate-300">
              {this.state.error.message}
            </pre>
            <Button
              variant="primary"
              block
              className="mt-5"
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
            >
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
