import { useEffect, Suspense } from "react";
import { useRoutes } from "react-router-dom";
/* Thius is fine: https://github.com/hannoeru/vite-plugin-pages/issues/120 */
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
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE
      );
      `);
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PGliteProvider db={db}>{useRoutes(routes)}</PGliteProvider>
    </Suspense>
  );
}

export default App;
