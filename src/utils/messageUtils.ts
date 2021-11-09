import { createContext, Dispatch, ReducerState } from 'react'

export type Level = 'OK' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG'

let msg: string = ''
let level: Level = 'INFO'
let time: number = 0

const dispatch: Dispatch<MessageState> = () => {}

interface MessageState {
  msg: string,
  level: Level,
  time?: number
}

export const MessageContext = createContext([
  { msg, level, time },
  dispatch
] as const)

/**
 * @description Method to get error message
 * @returns error message
 */
export const getMessage = (): MessageState => ({
  msg,
  level,
  time
})

/**
 * @description Method to set error
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns i18n state
 */
export const setMessage = (state: ReducerState<any>, newState: MessageState): MessageState => {
  msg = newState.msg
  level = newState.level
  time = (new Date()).getTime()

  return {
    msg,
    level,
    time
  }
}