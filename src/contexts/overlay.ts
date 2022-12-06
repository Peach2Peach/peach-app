import { createContext, Dispatch, ReactNode, ReducerState } from 'react'

let content: ReactNode
let visible = false
let title = ''
let action1 = () => {}
let action1Label = ''
let action1Icon = 'alertTriangle'
let action2 = () => {}
let action2Label = ''
let action2Icon = 'alertTriangle'
let level = 'DEFAULT' as OverlayLevel

const dispatch: Dispatch<OverlayState> = () => {}

export const OverlayContext = createContext([
  {
    title,
    content,
    action1,
    action1Label,
    action1Icon,
    action2,
    action2Icon,
    action2Label,
    level,
    visible,
  },
  dispatch,
] as const)

/**
 * @description Method to get overlay content
 * @returns overlay content
 */
export const getOverlay = (): OverlayState => ({
  title,
  content,
  action1,
  action1Label,
  action1Icon,
  action2,
  action2Icon,
  action2Label,
  level,
  visible,
})

/**
 * @description Method to set overlay content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns overlay state
 */
export const setOverlay = (state: ReducerState<any>, newState: OverlayState): OverlayState => {
  content = newState.content
  title = newState.title || ''
  visible = newState.visible
  action1 = newState.action1 || (() => {})
  action1Label = newState.action1Label || ''
  action1Icon = newState.action1Icon || null
  action2 = newState.action2 || (() => {})
  action2Label = newState.action2Label || ''
  action2Icon = newState.action2Icon || null
  level = newState.level || 'DEFAULT'

  return {
    title,
    content,
    action1,
    action1Label,
    action1Icon,
    action2,
    action2Icon,
    action2Label,
    level,
    visible,
  }
}
