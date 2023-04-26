import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
}

const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
}
type PopupStore = PopupState & {
  showPopup: (params?: { content?: ReactElement }) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set) => ({
  ...defaultPopupState,
  showPopup: (params?: { content?: ReactElement }) => {
    set({ visible: true, content: params?.content })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
