import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImageGalleryStore } from "../hooks/useImageGalleryStore";

interface IImageGridProps {
  imagesPerPage?: number;
}

export function ImageGrid({ imagesPerPage }: IImageGridProps) {
  const IMAGES_PER_PAGE = imagesPerPage ?? 12;
  const images = useImageGalleryStore((state) => state.images);
  const currentPage = useImageGalleryStore((state) => state.currentPage);
  const selectedImages = useImageGalleryStore((state) => state.selectedImages);
  const toggleImageSelection = useImageGalleryStore(
    (state) => state.toggleImageSelection
  );
  const selectAllOnCurrentPage = useImageGalleryStore(
    (state) => state.selectAllOnCurrentPage
  );
  const clearImageSelection = useImageGalleryStore(
    (state) => state.clearImageSelection
  );
  const directoryName = useImageGalleryStore((state) => state.directoryName);

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    const allSelected = currentImages.every((_, index) =>
      selectedImages.has(startIndex + index)
    );
    if (allSelected) {
      clearImageSelection();
    } else {
      selectAllOnCurrentPage(IMAGES_PER_PAGE);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {directoryName ? `${directoryName} - Image Gallery` : "Image Gallery"}
        </h2>
        <Button onClick={handleSelectAll}>
          {currentImages.every((_, index) =>
            selectedImages.has(startIndex + index)
          )
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4 md:grid-cols-4">
        {currentImages.map((image, index) => (
          <Card
            key={startIndex + index}
            className={`cursor-pointer ${
              selectedImages.has(startIndex + index)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => toggleImageSelection(startIndex + index)}
          >
            <CardContent className="p-2">
              <p>{image.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
