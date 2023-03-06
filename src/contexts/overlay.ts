import { createContext, Dispatch, ReducerState, useReducer } from 'react'

export const defaultOverlay: OverlayState = {
  content: undefined,
  visible: false,
  title: '',
  action1: undefined,
  action2: undefined,
  level: 'DEFAULT',
  requireUserAction: false,
}

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([defaultOverlay, dispatch] as const)

const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => ({
  ...defaultOverlay,
  ...newState,
})

export const useOverlay = () => useReducer(setOverlay, defaultOverlay)
