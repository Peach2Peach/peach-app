import { createContext, Dispatch, ReactNode, ReducerState } from 'react'

let overlayContent: ReactNode

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([
  { overlayContent },
  dispatch
] as const)

/**
 * @description Method to get overlay content
 * @returns overlay content
 */
export const getOverlay = (): OverlayState => ({
  overlayContent,
})

/**
 * @description Method to set overlay content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns overlay state
 */
export const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => {
  overlayContent = newState.overlayContent

  return {
    overlayContent,
  }
}