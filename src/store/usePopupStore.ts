import { create } from 'zustand'

type PopupStore = {
  visible: boolean
  content: undefined
  showPopup: () => void
  closePopup: () => void
}

const defaultPopupState = {
  visible: false,
  content: undefined,
}

export const usePopupStore = create<PopupStore>((set) => ({
  ...defaultPopupState,
  showPopup: () => {
    set({ visible: true })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
