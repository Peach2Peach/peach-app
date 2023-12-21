import { create } from 'zustand'

export type PopupState = {
  visible: boolean
  popupComponent: React.ReactElement<unknown> | undefined
}

export const defaultPopupState: PopupState = {
  visible: false,
  popupComponent: undefined,
}
type PopupStore = PopupState & {
  setPopup: (params?: PopupState['popupComponent']) => void
  closePopup: () => void
}

export const usePopupStore = create<PopupStore>((set) => ({
  ...defaultPopupState,
  setPopup: (params) => {
    set(() => ({
      visible: true,
      popupComponent: params,
    }))
  },
  closePopup: () => {
    set({ visible: false })
  },
}))
