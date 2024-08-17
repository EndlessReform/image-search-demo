import { useState } from "react";
import { Search, File, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePGlite } from "@electric-sql/pglite-react";
import useClipEmbeddings from "@/hooks/useClipEmbeddings";

interface FileSearchResult {
  fname: string;
  directory: string;
  distance: number;
}

const FileSearchUI = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoading, embedText, error } = useClipEmbeddings();
  const [searchResults, setSearchResults] = useState<FileSearchResult[]>([]);
  const db = usePGlite();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && error === null) {
      const embeddings = await embedText([searchTerm]);
      if (embeddings !== null) {
        const results = await db.query(
          `SELECT fname, directory, embedding <=> $1 AS distance 
            FROM image_search
            ORDER BY distance ASC
            LIMIT 10;
            `,
          [`[${embeddings[0]}]`]
        );
        console.log(results);
        setSearchResults(results.rows as FileSearchResult[]);
      }
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Image Search</h1>

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

      <div className="space-y-2">
        {searchResults.map((file, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-4">
              <div className="mr-4">
                <File className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-grow">
                <span className="font-medium truncate">{file.fname}</span>
              </div>
              <div className="text-sm text-gray-500">
                Similarity: {file.distance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileSearchUI;
