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
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";
import { DirectorySelector } from "@/components/DirectorySelector";
import { ImageGrid } from "@/components/ImageGrid";
import { Pagination } from "@/components/Pagination";
import { UploadButton } from "@/components/UploadButton";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { Loader2 } from "lucide-react";

export default function ImageGallery() {
  const { isLoading, error } = useClipEmbeddings();
  const isDirectorySelected = useImageGalleryStore(
    (state) => state.isDirectorySelected
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
      <h1 className="mb-4 text-2xl font-bold">Image Gallery</h1>
      {!isDirectorySelected ? (
        <DirectorySelector />
      ) : (
        <>
          <ImageGrid />
          <div className="flex items-center justify-between mb-4">
            <UploadButton />
            <Pagination />
          </div>
        </>
      )}
    </div>
  );
}
