import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";

export function DirectorySelector() {
  const setDirectoryHandle = useImageGalleryStore(
    (state) => state.setDirectoryHandle
  );
  const setImages = useImageGalleryStore((state) => state.setImages);
  const setDirectoryName = useImageGalleryStore(
    (state) => state.setDirectoryName
  );

  const handleDirectorySelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setDirectoryHandle(dirHandle);
      setDirectoryName(dirHandle.name);

      const imageEntries = [];
      for await (const entry of dirHandle.values()) {
        if (
          entry.kind === "file" &&
          entry.name.match(/\.(jpg|jpeg|png|gif)$/i)
        ) {
          imageEntries.push({ handle: entry, name: entry.name });
        }
      }
      setImages(imageEntries);
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
