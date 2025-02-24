import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FilterState {
  timeframe: string
  categories: string[]
  sources: string[]
  sortBy: string
}

export interface UserSettings {
  compareMode: boolean
  autoRefresh: boolean
  notificationsEnabled: boolean
}

interface GlobalState {
  theme: 'dark' | 'light'
  selectedStories: string[]
  compareMode: boolean
  filters: FilterState
  settings: UserSettings
  setTheme: (theme: 'dark' | 'light') => void
  toggleCompareMode: () => void
  updateFilters: (filters: Partial<FilterState>) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  selectStory: (id: string) => void
  unselectStory: (id: string) => void
}

export const useStore = create<GlobalState>()(
  persist(
    (set) => ({
      theme: 'dark',
      selectedStories: [],
      compareMode: false,
      filters: {
        timeframe: '7d',
        categories: [],
        sources: [],
        sortBy: 'relevance'
      },
      settings: {
        compareMode: false,
        autoRefresh: true,
        notificationsEnabled: true
      },
      setTheme: (theme) => set({ theme }),
      toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),
      updateFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      updateSettings: (settings) => set((state) => ({ 
        settings: { ...state.settings, ...settings } 
      })),
      selectStory: (id) => set((state) => ({ 
        selectedStories: [...state.selectedStories, id] 
      })),
      unselectStory: (id) => set((state) => ({ 
        selectedStories: state.selectedStories.filter((storyId) => storyId !== id) 
      }))
    }),
    {
      name: 'unveil-storage'
    }
  )
)