import { memo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePGlite } from "@electric-sql/pglite-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";
import { useImageGalleryStore } from "@/hooks/useImageGalleryStore";
import { ImagePreview } from "@/components/ImagePreview";
import { Masonry } from "masonic";

interface FileSearchResult {
  fname: string;
  directory: string;
  distance: number;
}

// TODO: Add pagination
const MAX_RESULT_COUNT = 20;
// TODO: Totally arbitrary
const MAX_DISTANCE = 0.755;

const SearchBarComponent = ({
  setSearchResults,
}: {
  setSearchResults: (results: FileSearchResult[]) => void;
}) => {
  const { isLoading, embedText, error } = useClipEmbeddings();
  const [searchTerm, setSearchTerm] = useState("");
  const directoryHandle = useImageGalleryStore(
    (state) => state.directoryHandle
  );
  const db = usePGlite();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && error === null) {
      const embeddings = await embedText([searchTerm]);
      if (embeddings !== null) {
        const results = await db.query(
          `SELECT fname, directory, embedding <=> $1 AS distance 
            FROM image_search
            WHERE directory = $2
            ORDER BY distance ASC
            LIMIT $3;
            `,
          [`[${embeddings[0]}]`, directoryHandle?.name, MAX_RESULT_COUNT]
        );
        console.log(results);
        setSearchResults(
          (results.rows as FileSearchResult[]).filter(
            (r) => r.distance <= MAX_DISTANCE
          )
        );
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex mb-4 space-x-2">
      <Input
        type="text"
        placeholder="Search files..."
        className="flex-grow"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit" className="ml-2">
        <Search className="w-4 h-4 mr-2" /> Search
      </Button>
    </form>
  );
};

const FileSearchUI = () => {
  const [searchResults, setSearchResults] = useState<FileSearchResult[]>([]);
  const MasonryCard = memo(
    ({ data }: { data: FileSearchResult }) => {
      const imageMap = useImageGalleryStore((state) => state.imageMap);
      return (
        <div
          className={`mb-4 cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md`}
        >
          <div className="relative">
            <ImagePreview handle={imageMap[data.fname].handle} />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black bg-opacity-50 rounded-b-sm">
              <div className="flex items-center justify-between">
                <p className="flex-1 mr-2 text-sm truncate">{data.fname}</p>
                <div className="text-sm text-gray-400">
                  {data.distance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.data.fname === nextProps.data.fname
  );

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Image Search</h1>
      <SearchBarComponent setSearchResults={setSearchResults} />
      <div className="space-y-2">
        <Masonry
          items={searchResults}
          key={searchResults.length}
          render={MasonryCard}
          columnGutter={16}
          overscanBy={5}
        />
      </div>
    </div>
  );
};

export default FileSearchUI;
