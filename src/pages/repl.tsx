import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repl } from "@electric-sql/pglite-repl";
import { usePGlite } from "@electric-sql/pglite-react";

const PgReplPage = () => {
  const db = usePGlite();

  return (
    <div className="container p-4 mx-auto">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            PostgreSQL In-Memory REPL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg min-h-48">
              <Repl pg={db} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PgReplPage;
