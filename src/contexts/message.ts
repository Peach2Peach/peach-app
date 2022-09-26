import { createContext, Dispatch, ReactNode, ReducerState } from 'react'
import { Animated } from 'react-native'

export type Level = 'OK' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'

let template: ReactNode
let msgKey: string|undefined
let msg: string|undefined
let level: Level = 'OK'
let close: boolean = true
let time: number = 0

const dispatch: Dispatch<MessageState> = () => {}

export const MessageContext = createContext([
  { template, msgKey, msg, level: level as Level, close: close as boolean|undefined },
  dispatch
] as const)

/**
 * @description Method to get message
 * @returns message
 */
export const getMessage = (): MessageState => ({
  template,
  msgKey,
  msg,
  level,
  close,
  time,
})

/**
 * @description Method to set message
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns message state
 */
export const setMessage = (state: ReducerState<any>, newState: MessageState): MessageState => {
  template = newState.template
  msgKey = newState.msgKey
  msg = newState.msg
  level = newState.level
  close = newState.close ?? true
  time = (new Date()).getTime()

  return {
    template,
    msgKey,
    msg,
    level,
    close,
    time
  }
}


export const showMessageEffect = (content: ReactNode|string, width: number, slideInAnim: Animated.Value) => () => {
  let slideOutTimeout: NodeJS.Timer

  if (content) {
    Animated.timing(slideInAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start()

    if (close) {
      slideOutTimeout = setTimeout(() => Animated.timing(slideInAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: false
      }).start(), 1000 * 10)
    }
  }

  return () => clearTimeout(slideOutTimeout)
}