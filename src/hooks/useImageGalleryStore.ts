import create from "zustand";

export interface ImageEntry {
  handle: FileSystemFileHandle;
  name: string;
}

interface ImageGalleryState {
  images: ImageEntry[];
  currentPage: number;
  selectedImages: { [key: string]: boolean };
  isDirectorySelected: boolean;
  directoryName: string;
  setImages: (images: ImageEntry[]) => void;
  setCurrentPage: (page: number) => void;
  toggleImageSelection: (name: string) => void;
  clearImageSelection: () => void;
  setIsDirectorySelected: (isSelected: boolean) => void;
  selectAllOnCurrentPage: (currentPageImages: ImageEntry[]) => void;
  setDirectoryName: (name: string) => void;
  isImageSelected: (name: string) => boolean;
}

export const useImageGalleryStore = create<ImageGalleryState>((set, get) => ({
  images: [],
  currentPage: 1,
  selectedImages: {},
  isDirectorySelected: false,
  directoryName: "",
  setImages: (images) => set({ images }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleImageSelection: (name) =>
    set((state) => ({
      selectedImages: {
        ...state.selectedImages,
        [name]: !state.selectedImages[name],
      },
    })),
  clearImageSelection: () => set({ selectedImages: {} }),
  setIsDirectorySelected: (isSelected) =>
    set({ isDirectorySelected: isSelected }),
  selectAllOnCurrentPage: (currentPageImages) =>
    set((state) => {
      const newSelectedImages = { ...state.selectedImages };
      currentPageImages.forEach((image) => {
        newSelectedImages[image.name] = true;
      });
      return { selectedImages: newSelectedImages };
    }),
  setDirectoryName: (name) => set({ directoryName: name }),
  isImageSelected: (name) => get().selectedImages[name] || false,
}));
