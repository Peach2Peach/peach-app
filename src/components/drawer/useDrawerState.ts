import { create } from 'zustand'

export const defaultState: DrawerState = {
  title: '',
  content: null,
  options: [],
  show: false,
  previousDrawer: undefined,
  onClose: () => null,
}

type DrawerActions = {
  updateDrawer: (newState: Partial<DrawerState>) => void
}

export const useDrawerState = create<DrawerState & DrawerActions>((set) => ({
  ...defaultState,
  updateDrawer: (newState) =>
    set({
      title: newState.title || defaultState.title,
      content: newState.content ?? defaultState.content,
      options: newState.options ?? defaultState.options,
      show: newState.show ?? defaultState.show,
      previousDrawer: newState.previousDrawer,
      onClose: newState.onClose || defaultState.onClose,
    }),
}))
