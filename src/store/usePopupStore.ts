import { ReactElement } from 'react'
import { create } from 'zustand'

type PopupState = {
  visible: boolean
  content: ReactElement | undefined
  title: string
  action1: Action | undefined
  action2: Action | undefined
  level: Level
  requireUserAction: boolean
}

export const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: '',
  action1: undefined,
  action2: undefined,
  level: 'DEFAULT',
  requireUserAction: false,
}
type PopupStore = PopupState & {
  setPopup: (params?: Partial<PopupState>) => void
  showPopup: () => void
  closePopup: () => void
  updatePopup: (params?: Partial<PopupState>) => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  setPopup: (params) => {
    set({
      visible: params?.visible !== undefined ? params.visible : true,
      content: params?.content,
      title: params?.title || defaultPopupState.title,
      action1: params?.action1,
      action2: params?.action2,
      level: params?.level || defaultPopupState.level,
      requireUserAction: params?.requireUserAction || defaultPopupState.requireUserAction,
    })
  },
  showPopup: () => {
    set({ visible: true })
  },
  closePopup: () => {
    set({ visible: false })
  },
  updatePopup: (params) => {
    const newVisible = params ? params?.visible : get().visible
    const newContent = params ? params?.content : get().content
    const newTitle = params ? params?.title : get().title
    const newAction1 = params ? params?.action1 : get().action1
    const newAction2 = params ? params?.action2 : get().action2
    const newLevel = params ? params?.level : get().level
    set({
      visible: newVisible,
      content: newContent,
      title: newTitle,
      action1: newAction1,
      action2: newAction2,
      level: newLevel,
    })
  },
}))
