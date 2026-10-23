import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize = 8,
  onPageChange,
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (safePage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (safePage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5 ${className || ""}`}>
      <p className="text-xs text-muted-foreground">
        Menampilkan {from}–{to} dari {totalItems}
      </p>
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={safePage <= 1}
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          aria-label="Halaman sebelumnya"
          title="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Nomor halaman desktop & tablet */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={idx}
                type="button"
                size="sm"
                variant={p === safePage ? "default" : "outline"}
                className={`h-8 min-w-[2rem] px-2 text-xs transition-colors ${
                  p === safePage ? "gradient-brand text-brand-foreground font-bold shadow-xs border-transparent" : ""
                }`}
                onClick={() => onPageChange(p)}
                aria-label={`Ke halaman ${p}`}
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-1 text-xs text-muted-foreground select-none">
                …
              </span>
            )
          )}
        </div>

        {/* Tampilan ringkas di mobile */}
        <span className="grid min-w-[3rem] place-items-center px-1 text-xs font-medium sm:hidden">
          {safePage} / {totalPages}
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          aria-label="Halaman berikutnya"
          title="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
