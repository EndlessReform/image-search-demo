import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";
import { DirectorySelector } from "@/components/DirectorySelector";
import { ImageGrid } from "@/components/ImageGrid";
import { UploadButton } from "@/components/UploadButton";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMAGES_PER_PAGE = 15;

export default function ImageGallery() {
  const { isLoading, error } = useClipEmbeddings();
  const isDirectorySelected = useImageGalleryStore(
    (state) => state.isDirectorySelected
  );
  const directoryName = useImageGalleryStore((state) => state.directoryName);
  const setIsDirectorySelected = useImageGalleryStore(
    (state) => state.setIsDirectorySelected
  );
  const setDirectoryName = useImageGalleryStore(
    (state) => state.setDirectoryName
  );
  const setImages = useImageGalleryStore((state) => state.setImages);

  const handleDeselectDirectory = () => {
    setImages([]);
    setIsDirectorySelected(false);
    setDirectoryName("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading CLIP model...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Index images for search</h1>
      {!isDirectorySelected ? (
        <div className="flex flex-col items-center justify-center h-64">
          <DirectorySelector />
          <p className="mt-4 text-gray-600">
            Please select a directory containing images to start.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <div className="flex items-center justify-evenly">
              <span className="mr-2">Selected directory: {directoryName}</span>
              <Button
                onClick={handleDeselectDirectory}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Deselect
              </Button>
            </div>
            <UploadButton />
          </div>
          <div className="mt-4"></div>
          <ImageGrid imagesPerPage={IMAGES_PER_PAGE} />
        </>
      )}
    </div>
  );
}
