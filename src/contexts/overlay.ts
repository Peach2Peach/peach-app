import { createContext, Dispatch, ReactNode, ReducerState } from 'react'

let content: ReactNode
let showCloseIcon = false
let showCloseButton = false
let help = false
let isTransparent = false

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([
  { content, showCloseIcon, showCloseButton, help, isTransparent },
  dispatch
] as const)

/**
 * @description Method to get overlay content
 * @returns overlay content
 */
export const getOverlay = (): OverlayState => ({
  content,
  showCloseIcon,
  showCloseButton,
  help,
  isTransparent
})

/**
 * @description Method to set overlay content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns overlay state
 */
export const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => {
  content = newState.content
  showCloseIcon = newState.showCloseIcon ?? false
  showCloseButton = newState.showCloseButton ?? false
  help = newState.help ?? false
  isTransparent = newState.isTransparent ?? false

  return {
    content,
    showCloseIcon,
    showCloseButton,
    help,
    isTransparent
  }
}