import { createContext, Dispatch, ReactNode, ReducerState, useContext } from 'react'

let title = ''
let content: ReactNode
let show: boolean = false
let previousDrawer: Partial<DrawerState> = {}
let onClose = () => {}

const dispatch: Dispatch<Partial<DrawerState>> = () => {}

export const DrawerContext = createContext([{ title, content, show, onClose, previousDrawer }, dispatch] as const)
export const useDrawerContext = () => useContext(DrawerContext)

/**
 * @description Method to get drawer content
 * @returns drawer content
 */
export const getDrawer = (): DrawerState => ({
  title,
  content,
  show,
  previousDrawer,
  onClose,
})

/**
 * @description Method to set drawer content
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns drawer state
 */
export const setDrawer = (state: ReducerState<any>, newState: Partial<DrawerState>): DrawerState => {
  title = newState.title || title
  content = newState.content ?? content
  show = newState.show ?? true
  previousDrawer = newState.previousDrawer ?? {}
  onClose = newState.onClose || onClose

  return {
    title,
    content,
    show,
    previousDrawer,
    onClose,
  }
}
