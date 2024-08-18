import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import {
  useImageGalleryStore,
  ImageEntry,
} from "../hooks/useImageGalleryStore";
import { usePGlite } from "@electric-sql/pglite-react";

export function UploadButton() {
  const images = useImageGalleryStore((state) => state.images);
  const isImageSelected = useImageGalleryStore(
    (state) => state.isImageSelected
  );
  const selectedImages = useImageGalleryStore((state) => state.selectedImages);
  const clearImageSelection = useImageGalleryStore(
    (state) => state.clearImageSelection
  );
  const dirname = useImageGalleryStore((state) => state.directoryName);
  const { embedImage } = useClipEmbeddings();
  const db = usePGlite();

  // Debug logging
  useEffect(() => {
    console.log("Images:", images);
    console.log(selectedImages);
  }, [images, selectedImages]);
  const uploadImage = useCallback(
    async (image: ImageEntry) => {
      const file = await image.handle.getFile();
      const embedding = await embedImage([file]);
      if (embedding !== null) {
        await db.query(
          `INSERT INTO image_search (fname, directory, embedding)
        VALUES ($1, $2, $3)
        ON CONFLICT (directory, fname) DO NOTHING;`,
          [image.name, dirname, `[${embedding[0]}]`]
        );
        console.log(`${image.name} saved to DB!`);
      }
    },
    [embedImage, db, dirname]
  );

  const handleUpload = async () => {
    const selectedImages = images.filter((img) => isImageSelected(img.name));
    const batchSize = 4;

    for (let i = 0; i < selectedImages.length; i += batchSize) {
      const batch = selectedImages.slice(i, i + batchSize);
      await Promise.all(batch.map(uploadImage));
    }

    clearImageSelection();
  };

  return (
    <Button
      onClick={handleUpload}
      disabled={Object.keys(selectedImages).length === 0}
      className="flex items-center"
    >
      <Upload className="w-4 h-4 mr-2" /> Index Selected
    </Button>
  );
}
