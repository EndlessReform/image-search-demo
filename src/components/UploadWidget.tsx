import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { usePGlite } from "@electric-sql/pglite-react";
import { Progress } from "@/components/ui/progress";
import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FnameRow {
  fname: string;
}

export function UploadWidget() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const { embedImage } = useClipEmbeddings();
  const db = usePGlite();

  const directoryHandle = useImageGalleryStore(
    (state) => state.directoryHandle
  );
  const images = useImageGalleryStore((state) => state.images);
  const setDirectoryHandle = useImageGalleryStore(
    (state) => state.setDirectoryHandle
  );
  const directoryName = useImageGalleryStore((state) => state.directoryName);
  const setDirectoryName = useImageGalleryStore(
    (state) => state.setDirectoryName
  );
  const setImages = useImageGalleryStore((state) => state.setImages);

  const handleDeselectDirectory = () => {
    setImages([]);
    setDirectoryHandle(null);
    setDirectoryName("");
  };

  const uploadImage = useCallback(
    async (file: File, directoryName: string) => {
      const embedding = await embedImage([file]);
      if (embedding !== null) {
        await db.query(
          `INSERT INTO image_search (fname, directory, embedding)
        VALUES ($1, $2, $3)
        ON CONFLICT (directory, fname) DO NOTHING;`,
          [file.name, directoryName, `[${embedding[0]}]`]
        );
      }
    },
    [embedImage, db]
  );

  const handleUpload = async () => {
    if (!directoryHandle || images.length === 0) {
      setMessage("No directory selected or no images found.");
      return;
    }
    const files_result = await db.query(
      "SELECT fname FROM image_search WHERE directory = $1",
      [directoryHandle.name]
    );

    let totalImages: number = images.length;
    let imagesToFilter = images;
    if (files_result.rows.length > 0) {
      const fnames_in_db = new Set(
        (files_result.rows as FnameRow[]).map((row) => row.fname)
      );
      imagesToFilter = images.filter((image) => !fnames_in_db.has(image.name));
      totalImages = imagesToFilter.length;
    }

    setUploading(true);
    setProgress(0);
    setMessage("Starting upload...");

    let processed = 0;
    const batchSize = 8;

    for (let i = 0; i < totalImages; i += batchSize) {
      const batch = images.slice(i, Math.min(i + batchSize, totalImages));
      await Promise.all(
        batch.map(async (image) => {
          const file = await image.handle.getFile();

          await uploadImage(file, directoryHandle.name);

          processed++;
          setProgress(Math.round((processed / totalImages) * 100));
        })
      );

      setMessage(`Processed ${processed} out of ${totalImages} images...`);
    }

    setUploading(false);
    setMessage(
      totalImages === 0 ? "All images already uploaded!" : "Upload complete!"
    );
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <div className="flex items-center w-full">
        <span className="mr-2">Selected directory: {directoryName}</span>
        <Button
          onClick={handleDeselectDirectory}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <X className="w-4 h-4 mr-1" /> Deselect
        </Button>
        <div className="ml-auto space-y-4">
          <Button
            onClick={handleUpload}
            disabled={uploading || !directoryHandle}
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : `Upload ${images.length} Images`}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {uploading && <Progress value={progress} className="w-full mb-2" />}
        {message && (
          <Alert>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
