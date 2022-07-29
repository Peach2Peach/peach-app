import { createContext, Dispatch, ReactNode, ReducerState } from 'react'

let title = ''
let content: ReactNode

const dispatch: Dispatch<DrawerState> = () => {}

export const DrawerContext = createContext([
  { title, content },
  dispatch
] as const)

/**
 * @description Method to get drawer content
 * @returns drawer content
 */
export const getDrawer = (): DrawerState => ({
  title,
  content,
})

/**
 * @description Method to set drawer content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns drawer state
 */
export const setDrawer = (state: ReducerState<any>, newState: DrawerState): DrawerState => {
  title = newState.title || title
  content = newState.content

  return {
    title,
    content,
  }
}