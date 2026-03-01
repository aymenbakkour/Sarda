import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { get, set, del } from 'idb-keyval';

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type StoryStatus = 'draft' | 'ready' | 'published';

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Story {
  id: string;
  folderId: string;
  title: string;
  content: string;
  status: StoryStatus;
  targetDate: string;
  publishTime: string;
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  folders: Folder[];
  stories: Story[];
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStory: (id: string, story: Partial<Omit<Story, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteStory: (id: string) => void;
  importData: (data: { folders: Folder[], stories: Story[] }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      folders: [],
      stories: [],
      addFolder: (name) => set((state) => ({
        folders: [...state.folders, { id: uuidv4(), name, createdAt: Date.now() }]
      })),
      updateFolder: (id, name) => set((state) => ({
        folders: state.folders.map(f => f.id === id ? { ...f, name } : f)
      })),
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        stories: state.stories.filter(s => s.folderId !== id)
      })),
      addStory: (story) => set((state) => ({
        stories: [...state.stories, { ...story, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now() }]
      })),
      updateStory: (id, story) => set((state) => ({
        stories: state.stories.map(s => s.id === id ? { ...s, ...story, updatedAt: Date.now() } : s)
      })),
      deleteStory: (id) => set((state) => ({
        stories: state.stories.filter(s => s.id !== id)
      })),
      importData: (data) => set(() => ({
        folders: data.folders || [],
        stories: data.stories || []
      }))
    }),
    {
      name: 'sarda-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
