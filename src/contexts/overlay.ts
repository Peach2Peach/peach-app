import { createContext, Dispatch, ReducerState, useReducer } from 'react'

export const defaultOverlay: OverlayState = {
  content: undefined,
  visible: false,
  title: '',
  action1: () => {},
  action1Label: '',
  action1Icon: 'alertTriangle',
  action2: () => {},
  action2Label: '',
  action2Icon: 'alertTriangle',
  level: 'DEFAULT',
  closeOnTap: true,
}

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([defaultOverlay, dispatch] as const)

const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => ({
  ...defaultOverlay,
  ...newState,
})

export const useOverlay = () => useReducer(setOverlay, defaultOverlay)
