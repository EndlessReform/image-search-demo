import { create } from "zustand";

export interface ImageEntry {
  handle: FileSystemFileHandle;
  name: string;
}

interface ImageGalleryState {
  directoryHandle: FileSystemDirectoryHandle | null;
  images: ImageEntry[];
  imageMap: Record<string, ImageEntry>;
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setImages: (images: ImageEntry[]) => void;
  setImageMap: (images: ImageEntry[]) => void;
}

export const useImageGalleryStore = create<ImageGalleryState>((set) => ({
  directoryHandle: null,
  images: [],
  imageMap: {},
  setDirectoryHandle: (handle) => set({ directoryHandle: handle }),
  setImages: (images) => set({ images }),
  setImageMap: (images) =>
    set({
      imageMap: Object.fromEntries(images.map((image) => [image.name, image])),
    }),
}));
