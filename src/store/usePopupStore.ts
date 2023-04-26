import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: undefined
}

const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
}
type PopupStore = PopupState & {
  showPopup: () => void
  closePopup: () => void
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
