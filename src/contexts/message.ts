import { createContext, Dispatch, ReactNode, ReducerState, useContext } from 'react'
import { Animated } from 'react-native'

const state: MessageState = {
  level: 'DEFAULT',
  keepAlive: false,
  time: 0,
}

const dispatch: Dispatch<MessageState> = () => {}

export const MessageContext = createContext([state, dispatch] as const)
export const useMessageContex = () => useContext(MessageContext)

/**
 * @description Method to get message
 * @returns message
 */
export const getMessage = (): MessageState => state

/**
 * @description Method to set message
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns message state
 */
export const setMessage = (oldState: ReducerState<any>, newState: MessageState): MessageState => {
  state.msgKey = newState.msgKey
  state.bodyArgs = newState.bodyArgs
  state.level = newState.level
  state.action = newState.action || undefined
  state.onClose = newState.onClose || undefined
  state.action = newState.action
  state.keepAlive = newState.keepAlive || false
  state.time = Date.now()

  return { ...state }
}

export const showMessageEffect = (content: ReactNode | string, width: number, slideInAnim: Animated.Value) => () => {
  let slideOutTimeout: NodeJS.Timer

  if (content) {
    Animated.timing(slideInAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    if (!state.keepAlive) {
      slideOutTimeout = setTimeout(
        () =>
          Animated.timing(slideInAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: false,
          }).start(),
        1000 * 10,
      )
    }
  }

  return () => clearTimeout(slideOutTimeout)
}
