import { create } from 'zustand'

type PopupStore = {
  visible: boolean
  content: undefined
}

const defaultPopupState = {
  visible: false,
  content: undefined,
}

export const usePopupStore = create<PopupStore>(() => ({
  ...defaultPopupState,
}))
