import { useState, useEffect } from "react";

export function ImagePreview({ handle }: { handle: FileSystemFileHandle }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const file = await handle.getFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target?.result as string);

          // Calculate aspect ratio
          const img = new Image();
          img.onload = () => {
            setAspectRatio(img.width / img.height);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [handle]);

  return (
    <div
      style={{ paddingBottom: `${100 / aspectRatio}%` }}
      className="relative w-full"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Preview"
          className="absolute top-0 left-0 object-cover w-full h-full rounded"
        />
      ) : (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-200 rounded">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
}
