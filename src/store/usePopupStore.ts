import { isValidElement } from 'react'
import { create } from 'zustand'
import { isDefined } from '../utils/validation/isDefined'

export type PopupState = {
  visible: boolean
  content: JSX.Element | undefined
  title: string
  action1: Action | undefined
  action2: Action | undefined
  level: Level
  requireUserAction: boolean
  popupComponent: React.ReactElement<unknown> | undefined
}

export const defaultPopupState: PopupState = {
  visible: false,
  content: undefined,
  title: '',
  action1: undefined,
  action2: undefined,
  level: 'DEFAULT',
  requireUserAction: false,
  popupComponent: undefined,
}
type PopupStore = PopupState & {
  setPopup: (params?: Partial<PopupState> | PopupState['popupComponent']) => void
  showPopup: () => void
  closePopup: () => void
  updatePopup: (params?: Partial<PopupState>) => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  ...defaultPopupState,
  setPopup: (params) => {
    set(() => {
      if (!isValidElement(params)) {
        return {
          visible: params?.visible !== undefined ? params.visible : true,
          content: params?.content,
          title: params?.title || defaultPopupState.title,
          action1: params?.action1,
          action2: params?.action2,
          level: params?.level || defaultPopupState.level,
          requireUserAction: params?.requireUserAction || defaultPopupState.requireUserAction,
          popupComponent: params?.popupComponent,
        }
      }
      return {
        visible: true,
        popupComponent: params,
        requireUserAction: false,
      }
    })
  },
  showPopup: () => {
    set({ visible: true })
  },
  closePopup: () => {
    set({ visible: false })
  },
  updatePopup: (params) => {
    const newVisible = isDefined(params) && Object.hasOwn(params, 'visible') ? params?.visible : get().visible
    const newContent = isDefined(params) && Object.hasOwn(params, 'content') ? params?.content : get().content
    const newTitle = isDefined(params) && Object.hasOwn(params, 'title') ? params?.title : get().title
    const newAction1 = isDefined(params) && Object.hasOwn(params, 'action1') ? params?.action1 : get().action1
    const newAction2 = isDefined(params) && Object.hasOwn(params, 'action2') ? params?.action2 : get().action2
    const newLevel = isDefined(params) && Object.hasOwn(params, 'level') ? params?.level : get().level
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
