import { create } from 'zustand'

type PopupStore = {
  visible: boolean
}

export const usePopupStore = create<PopupStore>(() => ({
  visible: false,
}))
