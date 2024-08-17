import { useEffect, Suspense } from "react";
import { useRoutes } from "react-router-dom";
/* This is fine: https://github.com/hannoeru/vite-plugin-pages/issues/120 */
/** @ts-ignore */
import routes from "~react-pages";
import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import { vector } from "@electric-sql/pglite/vector";

const db = await PGlite.create({
  dataDir: "idb://pg-todo-test",
  extensions: { live, vector },
});

function App() {
  useEffect(() => {
    // Start up the DB
    db.exec(`
      CREATE EXTENSION vector;
      CREATE TABLE IF NOT EXISTS image_search (
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        directory TEXT NOT NULL,
        embedding vector(512),
        UNIQUE (directory, fname)
      );
      CREATE INDEX idx_fname ON image_search(fname);
      `);
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PGliteProvider db={db}>{useRoutes(routes)}</PGliteProvider>
    </Suspense>
  );
}

export default App;
