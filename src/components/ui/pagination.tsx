"use client";

import { PaginationMeta } from "@/types/global";
import { useFilter } from "@/hooks/use-filter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  meta: PaginationMeta;
};

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export const Pagination = ({ meta }: PaginationProps) => {
  const { setFilter } = useFilter();
  const { page, totalPages } = meta;

  if (totalPages <= 1) return null;

  const pages = generatePagination(page, totalPages);

  const handlePageChange = (newPage: number) => {
    setFilter("page", newPage === 1 ? null :  newPage.toString());
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1 sm:gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="hidden size-9 cursor-pointer sm:flex"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p, index) => {
        if (p === "...") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="text-muted-foreground flex size-9 items-center justify-center"
            >
              <MoreHorizontal className="size-4" />
            </div>
          );
        }

        const pageNumber = p as number;
        const isActive = pageNumber === page;

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "outline"}
            size="icon"
            onClick={() => handlePageChange(pageNumber)}
            className={`size-9 cursor-pointer ${isActive ? "pointer-events-none" : ""}`}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="hidden size-9 cursor-pointer sm:flex"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};