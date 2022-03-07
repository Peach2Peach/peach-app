import { createContext, Dispatch, ReducerState } from 'react'

export type Level = 'OK' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'

let msg: string = ''
let level: Level = 'OK'
let time: number = 0

const dispatch: Dispatch<MessageState> = () => {}

export const MessageContext = createContext([
  { msg, level: level as Level },
  dispatch
] as const)

/**
 * @description Method to get message
 * @returns message
 */
export const getMessage = (): MessageState => ({
  msg,
  level,
  time
})

/**
 * @description Method to set message
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns message state
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