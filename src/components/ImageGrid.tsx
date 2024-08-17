import { Card, CardContent } from "@/components/ui/card";
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

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-3 gap-4 mb-4 md:grid-cols-4">
      {currentImages.map((image, index) => (
        <Card
          key={startIndex + index}
          className={`cursor-pointer ${
            selectedImages.has(startIndex + index) ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => toggleImageSelection(startIndex + index)}
        >
          <CardContent className="p-2">
            <p>{image.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
