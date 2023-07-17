import { createContext, Dispatch, ReducerState, useContext } from 'react'

export const defaultState: DrawerState = {
  title: '',
  content: null,
  options: [],
  show: false,
  previousDrawer: undefined,
  onClose: () => {},
}

const dispatch: Dispatch<Partial<DrawerState>> = () => {}

export const DrawerContext = createContext([defaultState, dispatch] as const)
export const useDrawerContext = () => useContext(DrawerContext)

export const setDrawer = (state: ReducerState<any>, newState: Partial<DrawerState>): DrawerState => ({
  title: newState.title || '',
  content: newState.content ?? null,
  options: newState.options ?? [],
  show: newState.show ?? false,
  previousDrawer: newState.previousDrawer,
  onClose: newState.onClose || (() => {}),
})
