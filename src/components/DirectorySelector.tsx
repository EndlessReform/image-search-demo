import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useImageGalleryStore } from "../hooks/useImageGalleryStore";

export function DirectorySelector() {
  const setImages = useImageGalleryStore((state) => state.setImages);
  const setIsDirectorySelected = useImageGalleryStore(
    (state) => state.setIsDirectorySelected
  );
  const setDirectoryName = useImageGalleryStore(
    (state) => state.setDirectoryName
  );

  const handleSelectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const newImages = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(jpe?g|png|gif)$/i)) {
          newImages.push({ handle: entry, name: entry.name });
        }
      }
      setImages(newImages);
      setIsDirectorySelected(true);
      setDirectoryName(dirHandle.name);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  };

  return (
    <Button onClick={handleSelectDirectory} className="flex items-center">
      <FolderOpen className="w-4 h-4 mr-2" /> Select Image Directory
    </Button>
  );
}
