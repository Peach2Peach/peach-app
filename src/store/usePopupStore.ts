import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
  title: string | undefined
  action1: Action | undefined
  action2: Action | undefined
}

const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: undefined,
  action1: undefined,
  action2: undefined,
}
type PopupStore = PopupState & {
  showPopup: (params?: { content?: ReactElement; title?: string; action1?: Action; action2?: Action }) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  showPopup: (params) => {
    const newContent = params ? params?.content : get().content
    const newTitle = params ? params?.title : get().title
    const newAction1 = params ? params?.action1 : get().action1
    const newAction2 = params ? params?.action2 : get().action2
    set({ visible: true, content: newContent, title: newTitle, action1: newAction1, action2: newAction2 })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
