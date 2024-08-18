import { Button } from "@/components/ui/button";
import { Pagination as PaginationUI } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImageGalleryStore } from "../hooks/useImageGalleryStore";

interface IPaginationProps {
  imagesPerPage?: number;
}

export function Pagination({ imagesPerPage }: IPaginationProps) {
  const IMAGES_PER_PAGE = imagesPerPage ?? 12;
  const images = useImageGalleryStore((state) => state.images);
  const currentPage = useImageGalleryStore((state) => state.currentPage);
  const setCurrentPage = useImageGalleryStore((state) => state.setCurrentPage);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

  return (
    <PaginationUI className="items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="mx-2">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </PaginationUI>
  );
}
