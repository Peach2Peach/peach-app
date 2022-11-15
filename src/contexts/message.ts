import { createContext, Dispatch, ReactNode, ReducerState } from 'react'
import { Animated } from 'react-native'

const state: MessageState = {
  level: 'OK',
  keepAlive: false,
  time: 0,
}

const dispatch: Dispatch<MessageState> = () => {}

export const MessageContext = createContext([state, dispatch] as const)

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
  state.template = newState.template
  state.msgKey = newState.msgKey
  state.msg = newState.msg
  state.level = newState.level
  state.action = newState.action
  state.actionLabel = newState.actionLabel
  state.actionIcon = newState.actionIcon
  state.keepAlive = newState.keepAlive ?? false
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

    if (state.keepAlive) {
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
