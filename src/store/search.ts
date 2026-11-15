import { create } from 'zustand'

/** Whether the search palette is open (opened from the notch, "/" or Ctrl/⌘+K). */
export const useSearch = create<{ open: boolean; setOpen: (open: boolean) => void }>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
