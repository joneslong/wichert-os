import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // zentraler Fehlerlog
    console.error("[UI ERROR]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          Uups – da ging was schief. Bitte neu laden. (Fehler wurde geloggt.)
        </div>
      );
    }
    return this.props.children;
  }
}
