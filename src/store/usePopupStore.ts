import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
  title: string
  action1: Action | undefined
  action2: Action | undefined
  level: Level
}

export const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: '',
  action1: undefined,
  action2: undefined,
  level: 'DEFAULT',
}
type PopupStore = PopupState & {
  showPopup: (params?: {
    content?: ReactElement
    title?: string
    action1?: Action
    action2?: Action
    level?: Level
  }) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  showPopup: (params) => {
    const newContent = params ? params?.content : get().content
    const newTitle = params ? params?.title : get().title
    const newAction1 = params ? params?.action1 : get().action1
    const newAction2 = params ? params?.action2 : get().action2
    const newLevel = params ? params?.level : get().level
    set({
      visible: true,
      content: newContent,
      title: newTitle,
      action1: newAction1,
      action2: newAction2,
      level: newLevel,
    })
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
