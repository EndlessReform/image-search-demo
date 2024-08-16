import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ClipboardList } from "lucide-react";
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";

interface ITodo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState("");

  const db = usePGlite();

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const ret = await db.query(
          "INSERT INTO todo (text, done) VALUES ($1, $2);",
          [newTodo, false]
        );
        console.log(ret);
        setNewTodo("");
      } catch (e) {
        console.error(e);
      }
    }
  };
  const items = useLiveQuery<ITodo>(
    `
    SELECT * FROM todo ORDER BY id DESC LIMIT 10`,
    []
  );

  return (
    <Card className="mx-auto mt-10 w-96">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My TODO List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 space-x-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            onKeyPress={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />
          <Button onClick={addTodo}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>

        {typeof items === "undefined" ? (
          <div className="py-8 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No todos yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new todo above.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.rows.map((row, k) => (
              <li key={k}>{row.text}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoApp;
