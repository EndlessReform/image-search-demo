import { create } from "zustand";

export interface ImageEntry {
  handle: FileSystemFileHandle;
  name: string;
}

interface ImageGalleryState {
  directoryHandle: FileSystemDirectoryHandle | null;
  images: ImageEntry[];
  directoryName: string;
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setImages: (images: ImageEntry[]) => void;
  setDirectoryName: (name: string) => void;
}

export const useImageGalleryStore = create<ImageGalleryState>((set) => ({
  directoryHandle: null,
  images: [],
  directoryName: "",
  setDirectoryHandle: (handle) => set({ directoryHandle: handle }),
  setImages: (images) => set({ images }),
  setDirectoryName: (name) => set({ directoryName: name }),
}));
