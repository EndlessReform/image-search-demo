import create from "zustand";

export interface ImageEntry {
  handle: FileSystemFileHandle;
  name: string;
}

interface ImageGalleryState {
  images: ImageEntry[];
  currentPage: number;
  selectedImages: Set<string>;
  isDirectorySelected: boolean;
  directoryName: string;
  setImages: (images: ImageEntry[]) => void;
  setCurrentPage: (page: number) => void;
  toggleImageSelection: (names: string | string[]) => void;
  clearImageSelection: () => void;
  setIsDirectorySelected: (isSelected: boolean) => void;
  selectAllOnCurrentPage: (currentPageImages: ImageEntry[]) => void;
  setDirectoryName: (name: string) => void;
}

export const useImageGalleryStore = create<ImageGalleryState>((set) => ({
  images: [],
  currentPage: 1,
  selectedImages: new Set(),
  isDirectorySelected: false,
  directoryName: "",
  setImages: (images) => set({ images }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleImageSelection: (names) =>
    set((state) => {
      const newSet = new Set(state.selectedImages);
      const toggleName = (name: string) => {
        if (newSet.has(name)) {
          newSet.delete(name);
        } else {
          newSet.add(name);
        }
      };
      if (Array.isArray(names)) {
        names.forEach(toggleName);
      } else {
        toggleName(names);
      }
      return { selectedImages: newSet };
    }),
  clearImageSelection: () => set({ selectedImages: new Set() }),
  setIsDirectorySelected: (isSelected) =>
    set({ isDirectorySelected: isSelected }),
  selectAllOnCurrentPage: (currentPageImages) =>
    set((state) => {
      const newSelectedImages = new Set(state.selectedImages);
      currentPageImages.forEach((image) => newSelectedImages.add(image.name));
      return { selectedImages: newSelectedImages };
    }),
  setDirectoryName: (name) => set({ directoryName: name }),
}));
