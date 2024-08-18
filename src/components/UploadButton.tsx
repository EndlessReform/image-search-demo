import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { useImageGalleryStore } from "../hooks/useImageGalleryStore";
import { usePGlite } from "@electric-sql/pglite-react";

export function UploadButton() {
  const images = useImageGalleryStore((state) => state.images);
  const selectedImages = useImageGalleryStore((state) => state.selectedImages);
  const dirname = useImageGalleryStore((state) => state.directoryName);
  const { embedImage } = useClipEmbeddings();

  const db = usePGlite();

  const handleUpload = async () => {
    for (const index of selectedImages) {
      const image = images[index];
      const file = await image.handle.getFile();
      const embedding = await embedImage([file]);
      console.log(`Embedding for image ${image.name}:`, embedding);
      console.log(
        `Image embedding size: ${embedding !== null ? embedding[0]?.length : 0}`
      );
      if (embedding !== null) {
        db.query(
          `INSERT INTO image_search (fname, directory, embedding)
        VALUES ($1, $2, $3)
        ON CONFLICT (directory, fname) DO NOTHING;
        `,
          [image.name, dirname, `[${embedding[0]}]`]
        );
        console.log(`${image.name} saved to DB!`);
      }
    }
    useImageGalleryStore.getState().clearImageSelection();
  };

  return (
    <Button
      onClick={handleUpload}
      disabled={selectedImages.size === 0}
      className="flex items-center"
    >
      <Upload className="w-4 h-4 mr-2" /> Index Selected
    </Button>
  );
}
