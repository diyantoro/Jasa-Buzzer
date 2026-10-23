import { useEffect, useState } from "react";
import { ExternalLink, Image as ImageIcon, Loader2, AlertCircle, FileText } from "lucide-react";
import { resolveProofItems } from "@/lib/proof-url";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProofLinkProps {
  proofUrl?: string | null;
  value?: string | null; // Compatibility with both buzzer and admin usages
  className?: string;
  showPostLink?: boolean;
  showDirectLink?: boolean;
}

export function ProofLink({
  proofUrl,
  value,
  className = "",
  showPostLink = true,
  showDirectLink = false,
}: ProofLinkProps) {
  const rawInput = proofUrl || value || "";
  const [resolved, setResolved] = useState<{ screenshotUrl: string | null; postUrl: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    if (!rawInput.trim()) {
      setResolved(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    resolveProofItems(rawInput)
      .then((res) => {
        if (active) {
          setResolved(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[ProofLink] Error resolving proof items:", err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [rawInput]);

  if (!rawInput.trim()) return null;

  if (loading) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground animate-pulse ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Memuat bukti...</span>
      </span>
    );
  }

  if (error || (!resolved?.screenshotUrl && !resolved?.postUrl)) {
    // Fallback: extract first part without pipe
    const fallbackUrl = rawInput.split(" | ")[0].trim();
    if (fallbackUrl) {
      return (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 ${className}`}
        >
          <ExternalLink className="h-3 w-3" />
          <span>Buka bukti</span>
        </a>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-rose-500 ${className}`}>
        <AlertCircle className="h-3 w-3" />
        <span>Bukti tidak dapat dibuka</span>
      </span>
    );
  }

  const { screenshotUrl, postUrl } = resolved;
  const isPdf = !!screenshotUrl && (screenshotUrl.toLowerCase().includes(".pdf") || screenshotUrl.toLowerCase().includes("application%2fpdf"));

  return (
    <>
      <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
        {screenshotUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-7 gap-1.5 rounded-md border-primary/20 bg-primary/10 px-2.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:text-primary transition-all cursor-pointer"
          >
            {isPdf ? <FileText className="h-3.5 w-3.5 text-rose-500" /> : <ImageIcon className="h-3.5 w-3.5" />}
            <span>{isPdf ? "Lihat Bukti (PDF)" : "Lihat Screenshot"}</span>
          </Button>
        )}

        {showDirectLink && screenshotUrl && (
          <a
            href={screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            title={isPdf ? "Buka file PDF di tab baru" : "Buka screenshot di tab baru"}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {showPostLink && postUrl && (
          <a
            href={postUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors"
            title={postUrl}
          >
            <ExternalLink className="h-3 w-3" />
            <span>Link Postingan</span>
          </a>
        )}
      </div>

      {screenshotUrl && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                {isPdf ? <FileText className="h-4 w-4 text-rose-500" /> : <ImageIcon className="h-4 w-4 text-primary" />}
                {isPdf ? "Dokumen Bukti Pengerjaan (PDF)" : "Bukti Screenshot Pekerjaan"}
              </DialogTitle>
              <div className="flex items-center gap-2 pr-6">
                <a
                  href={screenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {isPdf ? "Buka / Unduh PDF" : "Buka Tab Baru"}
                </a>
              </div>
            </DialogHeader>

            <div className="mt-3 flex-1 overflow-auto rounded-xl border border-border bg-muted/20 p-2 flex items-center justify-center min-h-[250px] max-h-[65vh]">
              {isPdf ? (
                <iframe
                  src={screenshotUrl}
                  title="Dokumen Bukti Pengerjaan PDF"
                  className="h-full w-full min-h-[450px] rounded-lg border-0"
                />
              ) : (
                <img
                  src={screenshotUrl}
                  alt="Screenshot Bukti Pengerjaan"
                  className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                />
              )}
            </div>

            {postUrl && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-card p-2.5 text-xs">
                <span className="text-muted-foreground">Link Postingan:</span>
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-medium text-primary hover:underline max-w-[280px] sm:max-w-md truncate"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{postUrl}</span>
                </a>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export default ProofLink;
