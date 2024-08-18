import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";

export function DirectorySelector() {
  const setDirectoryHandle = useImageGalleryStore(
    (state) => state.setDirectoryHandle
  );
  const setImages = useImageGalleryStore((state) => state.setImages);
  const setImageMap = useImageGalleryStore((state) => state.setImageMap);

  const handleDirectorySelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setDirectoryHandle(dirHandle);

      const imageEntries = [];
      for await (const entry of dirHandle.values()) {
        if (
          entry.kind === "file" &&
          entry.name.match(/\.(jpg|jpeg|png|gif)$/i)
        ) {
          const newEntry = { handle: entry, name: entry.name };
          imageEntries.push(newEntry);
        }
      }
      setImages(imageEntries);
      setImageMap(imageEntries);
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  return (
    <Button onClick={handleDirectorySelect} className="flex items-center">
      <FolderOpen className="w-4 h-4 mr-2" /> Select Directory
    </Button>
  );
}
