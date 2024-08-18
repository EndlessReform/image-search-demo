import React, { useMemo } from "react";
import { Masonry } from "masonic";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { Pagination } from "@/components/Pagination";
import { useImageGalleryStore, ImageEntry } from "@/hooks/useImageGalleryStore";
import { useLiveQuery } from "@electric-sql/pglite-react";

interface IImageGridProps {
  imagesPerPage?: number;
}

export function ImageGrid({ imagesPerPage = 12 }: IImageGridProps) {
  const images = useImageGalleryStore((state) => state.images);
  const currentPage = useImageGalleryStore((state) => state.currentPage);

  const selectAllOnCurrentPage = useImageGalleryStore(
    (state) => state.selectAllOnCurrentPage
  );
  const clearImageSelection = useImageGalleryStore(
    (state) => state.clearImageSelection
  );
  const directoryName = useImageGalleryStore((state) => state.directoryName);

  const dbItems = useLiveQuery(
    `SELECT fname FROM image_search WHERE directory = $1;`,
    [directoryName]
  );
  const dbFnames = dbItems?.rows.map((r: any) => r.fname);

  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = useMemo(() => {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    return images.slice(startIndex, endIndex);
  }, [images, currentPage, imagesPerPage]);

  const handleSelectAll = () => {
    const allSelected = currentImages.every((image) =>
      useImageGalleryStore.getState().isImageSelected(image.name)
    );
    if (allSelected) {
      clearImageSelection();
    } else {
      selectAllOnCurrentPage(currentImages);
    }
  };

  const MasonryCard = React.memo(
    ({ data }: { data: ImageEntry }) => {
      const isSelected = useImageGalleryStore((state) =>
        state.isImageSelected(data.name)
      );
      const toggleImageSelection = useImageGalleryStore(
        (state) => state.toggleImageSelection
      );

      return (
        <div
          className={`mb-4 cursor-pointer overflow-hidden transition-all duration-200 ${
            isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => toggleImageSelection(data.name)}
        >
          <div className="relative">
            <ImagePreview handle={data.handle} />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black bg-opacity-50 rounded-b-sm">
              <div className="flex items-center justify-between">
                <p className="flex-1 mr-2 text-sm truncate">{data.name}</p>
                {dbFnames?.includes(data.name) ? (
                  <Check className="flex-shrink-0 text-green-500" size={16} />
                ) : (
                  <X className="flex-shrink-0 text-red-500" size={16} />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.data.name === nextProps.data.name
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold shrink-0">Image Gallery</h2>
        <Pagination imagesPerPage={imagesPerPage} />
        <Button onClick={handleSelectAll}>Select All</Button>
      </div>
      <Masonry
        items={currentImages}
        render={MasonryCard}
        columnGutter={16}
        columnWidth={250}
        overscanBy={5}
      />
      <div className="flex justify-center mt-4">
        <Pagination imagesPerPage={imagesPerPage} />
      </div>
    </>
  );
}
