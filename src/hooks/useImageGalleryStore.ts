import create from "zustand";

interface ImageEntry {
  handle: FileSystemFileHandle;
  name: string;
}

interface ImageGalleryState {
  images: ImageEntry[];
  currentPage: number;
  selectedImages: Set<number>;
  isDirectorySelected: boolean;
  setImages: (images: ImageEntry[]) => void;
  setCurrentPage: (page: number) => void;
  toggleImageSelection: (indices: number | number[]) => void;
  clearImageSelection: () => void;
  setIsDirectorySelected: (isSelected: boolean) => void;
}

export const useImageGalleryStore = create<ImageGalleryState>((set) => ({
  images: [],
  currentPage: 1,
  selectedImages: new Set(),
  isDirectorySelected: false,
  setImages: (images) => set({ images }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleImageSelection: (indices) =>
    set((state) => {
      const newSet = new Set(state.selectedImages);
      const toggleIndex = (index: number) => {
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      };

      if (Array.isArray(indices)) {
        indices.forEach(toggleIndex);
      } else {
        toggleIndex(indices);
      }
      return { selectedImages: newSet };
    }),
  clearImageSelection: () => set({ selectedImages: new Set() }),
  setIsDirectorySelected: (isSelected) =>
    set({ isDirectorySelected: isSelected }),
}));
