import { create } from 'zustand'

import { ReducerState } from 'react'

export const defaultState: DrawerState = {
  title: '',
  content: null,
  options: [],
  show: false,
  previousDrawer: undefined,
  onClose: () => {},
}

export const setDrawer = (state: ReducerState<any>, newState: Partial<DrawerState>): DrawerState => ({
  title: newState.title || '',
  content: newState.content ?? null,
  options: newState.options ?? [],
  show: newState.show ?? false,
  previousDrawer: newState.previousDrawer,
  onClose: newState.onClose || (() => {}),
})

type DrawerActions = {
  updateDrawer: (newState: Partial<DrawerState>) => void
}

export const useDrawerState = create<DrawerState & DrawerActions>((set) => ({
  ...defaultState,
  updateDrawer: (newState) =>
    set({
      title: newState.title || '',
      content: newState.content ?? null,
      options: newState.options ?? [],
      show: newState.show ?? false,
      previousDrawer: newState.previousDrawer,
      onClose: newState.onClose || (() => {}),
    }),
}))
