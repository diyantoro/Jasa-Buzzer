import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = { title?: string; children: ReactNode };
type State = { error: Error | null };

/**
 * Menahan error render pada satu section dashboard supaya tidak
 * membuat seluruh halaman menampilkan "This page didn't load".
 */
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[SectionErrorBoundary]", error);
    reportLovableError(error, { boundary: "admin_section" });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-bold">
          {this.props.title ?? "Bagian ini gagal dimuat"}
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Terjadi kesalahan saat menampilkan data. Coba muat ulang bagian ini.
        </p>
        <p className="mx-auto mt-2 max-w-md break-words text-xs text-muted-foreground/70">
          {error.message}
        </p>
        <Button className="mt-4" variant="outline" onClick={() => this.setState({ error: null })}>
          <RefreshCw className="mr-1 h-4 w-4" /> Coba lagi
        </Button>
      </div>
    );
  }
}
