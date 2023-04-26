import { create } from 'zustand'

type PopupStore = {
  visible: boolean
  content: undefined
}

export const usePopupStore = create<PopupStore>(() => ({
  visible: false,
  content: undefined,
}))
