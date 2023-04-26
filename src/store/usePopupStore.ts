import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
  title: undefined
}

const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: undefined,
}
type PopupStore = PopupState & {
  showPopup: (params?: { content?: ReactElement }) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  showPopup: (params?: { content?: ReactElement }) => {
    const newContent = params ? params?.content : get().content
    set({ visible: true, content: newContent })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
