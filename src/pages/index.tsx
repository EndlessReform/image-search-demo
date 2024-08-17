import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Loader2,
  FolderOpen,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";

// const db = usePGlite();

// const addTodo = async () => {
//   if (newTodo.trim() !== "") {
//     try {
//       const ret = await db.query(
//         "INSERT INTO todo (text, done) VALUES ($1, $2);",
//         [newTodo, false]
//       );
//       console.log(ret);
//       setNewTodo("");
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };
// const items = useLiveQuery<ITodo>(
//   `
//   SELECT * FROM todo ORDER BY id DESC LIMIT 10`,
//   []
// );

const IMAGES_PER_PAGE = 12;

export default function ImageGallery() {
  interface ImageEntry {
    handle: FileSystemFileHandle;
    name: string;
  }

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const { embedImage, isLoading, error } = useClipEmbeddings();
  const [isDirectorySelected, setIsDirectorySelected] = useState(false);

  const getImageFile = async (handle: FileSystemFileHandle) => {
    const file = await handle.getFile();
    return file;
  };

  const handleSelectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const newImages: ImageEntry[] = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(jpe?g|png|gif)$/i)) {
          newImages.push({ handle: entry, name: entry.name });
        }
      }
      setImages(newImages);
      setIsDirectorySelected(true);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  };

  const handleUpload = async () => {
    for (const index of selectedImages) {
      const image = images[index];
      const url = await getImageFile(image.handle);
      const embedding = await embedImage([url]);
      console.log(`Embedding for image ${image.name}:`, embedding);
      console.log(
        `Image embedding size: ${embedding !== null ? embedding[0]?.length : 0}`
      );
    }
    setSelectedImages(new Set());
  };

  const handleImageSelect = (index: number) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Image Gallery</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading CLIP model...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : !isDirectorySelected ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Button
            onClick={handleSelectDirectory}
            className="flex items-center mb-4"
          >
            <FolderOpen className="w-4 h-4 mr-2" /> Select Image Directory
          </Button>
          <p className="text-gray-600">
            Please select a directory containing images to start.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4 md:grid-cols-4">
            {currentImages.map((image, index) => (
              <Card
                key={startIndex + index}
                className={`cursor-pointer ${
                  selectedImages.has(startIndex + index)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => handleImageSelect(startIndex + index)}
              >
                <CardContent className="p-2">
                  {/* <img
                    src={image.handle.createURLForFileInDirectory()}
                    alt={image.name}
                    className="object-cover w-full h-40"
                  /> */}
                  <p>{image.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleUpload}
              disabled={selectedImages.size === 0}
              className="flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Selected
            </Button>
            <Pagination>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="mx-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
