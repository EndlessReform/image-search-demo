import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { useImageGalleryStore } from "../hooks/useImageGalleryStore";

export function UploadButton() {
  const images = useImageGalleryStore((state) => state.images);
  const selectedImages = useImageGalleryStore((state) => state.selectedImages);
  const { embedImage } = useClipEmbeddings();

  const handleUpload = async () => {
    for (const index of selectedImages) {
      const image = images[index];
      const file = await image.handle.getFile();
      const embedding = await embedImage([file]);
      console.log(`Embedding for image ${image.name}:`, embedding);
      console.log(
        `Image embedding size: ${embedding !== null ? embedding[0]?.length : 0}`
      );
    }
    useImageGalleryStore.getState().clearImageSelection();
  };

  return (
    <Button
      onClick={handleUpload}
      disabled={selectedImages.size === 0}
      className="flex items-center"
    >
      <Upload className="w-4 h-4 mr-2" /> Upload Selected
    </Button>
  );
}
