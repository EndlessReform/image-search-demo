import { useState, useEffect, useCallback } from "react";
import ClipWorker from "./clip.worker?worker";

// Update the Embedding type to be an array of number arrays
type Embedding = number[][] | null;

// Define the hook's return type
interface ClipEmbeddingsHook {
  embedImage: (images: File[]) => Promise<Embedding>;
  embedText: (text: string[]) => Promise<Embedding>;
  isLoading: boolean;
  error: Error | null;
}

// Define the worker message types
type WorkerMessageType = "initialize" | "embedImage" | "embedText";
type WorkerResponseType =
  | "initialized"
  | "imageEmbedding"
  | "textEmbedding"
  | "error";

interface WorkerMessage {
  type: WorkerMessageType;
  payload?: File[] | string[];
}

interface WorkerResponse {
  type: WorkerResponseType;
  result?: Embedding;
  error?: string;
}

const useClipEmbeddings = (): ClipEmbeddingsHook => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const clipWorker = new ClipWorker();
    setWorker(clipWorker);

    clipWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, error } = event.data;
      switch (type) {
        case "initialized":
          setIsLoading(false);
          break;
        case "error":
          setError(new Error(error));
          setIsLoading(false);
          break;
      }
    };

    clipWorker.postMessage({ type: "initialize" } as WorkerMessage);

    return () => clipWorker.terminate();
  }, []);

  const embedImage = useCallback(
    (imageBlobs: File[]): Promise<Embedding> => {
      return new Promise((resolve, reject) => {
        if (!worker) {
          reject(new Error("Worker not initialized"));
          return;
        }

        const messageHandler = (event: MessageEvent<WorkerResponse>) => {
          const { type, result, error } = event.data;
          if (type === "imageEmbedding") {
            worker.removeEventListener("message", messageHandler);
            resolve(result || null);
          } else if (type === "error") {
            worker.removeEventListener("message", messageHandler);
            reject(new Error(error));
          }
        };

        worker.addEventListener("message", messageHandler);
        worker.postMessage({
          type: "embedImage",
          payload: imageBlobs,
        } as WorkerMessage);
      });
    },
    [worker]
  );

  const embedText = useCallback(
    (text: string[]): Promise<Embedding> => {
      return new Promise((resolve, reject) => {
        if (!worker) {
          reject(new Error("Worker not initialized"));
          return;
        }

        const messageHandler = (event: MessageEvent<WorkerResponse>) => {
          const { type, result, error } = event.data;
          if (type === "textEmbedding") {
            worker.removeEventListener("message", messageHandler);
            resolve(result || null);
          } else if (type === "error") {
            worker.removeEventListener("message", messageHandler);
            reject(new Error(error));
          }
        };

        worker.addEventListener("message", messageHandler);
        worker.postMessage({
          type: "embedText",
          payload: text,
        } as WorkerMessage);
      });
    },
    [worker]
  );

  return { embedImage, embedText, isLoading, error };
};

export default useClipEmbeddings;
