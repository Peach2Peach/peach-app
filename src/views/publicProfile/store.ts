import create from 'zustand'

type ProfileStore = {
  currentUserPubkey: string
  setCurrentUserPubkey: (currentUserPubkey: string) => void
}

export const useProfileStore = create<ProfileStore>()((set) => ({
  currentUserPubkey: '',
  setCurrentUserPubkey: (currentUserPubkey: string) => set({ currentUserPubkey }),
}))
