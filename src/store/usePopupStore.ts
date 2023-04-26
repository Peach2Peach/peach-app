import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
  title: string | undefined
  action1: undefined
}

const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: undefined,
  action1: undefined,
}
type PopupStore = PopupState & {
  showPopup: (params?: { content?: ReactElement; title?: string }) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  showPopup: (params) => {
    const newContent = params ? params?.content : get().content
    const newTitle = params ? params?.title : get().title
    set({ visible: true, content: newContent, title: newTitle })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
