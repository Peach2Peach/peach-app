import { createContext, Dispatch, ReactNode, ReducerState } from 'react'

let content: ReactNode
let showCloseButton = true

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([
  { content, showCloseButton },
  dispatch
] as const)

/**
 * @description Method to get overlay content
 * @returns overlay content
 */
export const getOverlay = (): OverlayState => ({
  content,
  showCloseButton,
})

/**
 * @description Method to set overlay content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns overlay state
 */
export const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => {
  content = newState.content
  showCloseButton = newState.showCloseButton

  return {
    content,
    showCloseButton,
  }
}