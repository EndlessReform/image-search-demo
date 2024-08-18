import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";
import { DirectorySelector } from "@/components/DirectorySelector";
import { UploadWidget } from "@/components/UploadWidget";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { Loader2 } from "lucide-react";

export default function ImageGallery() {
  const { isLoading, error } = useClipEmbeddings();
  const isDirectorySelected = useImageGalleryStore(
    (state) => state.directoryHandle !== null
  );

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
          <UploadWidget />
        </>
      )}
    </div>
  );
}
