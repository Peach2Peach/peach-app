import { EffectCallback, useEffect } from 'react'
import { AppState } from 'react-native'

let appState = 'active'
let statChangeTime = new Date().getTime()

type AppStateEffectProps = {
  callback: (active: boolean, delta: number) => void
}

/**
 * @description Important, don't call this effect in multiple components.
 */
export default ({ callback }: AppStateEffectProps): EffectCallback =>
  () => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const now = new Date().getTime()
      if (appState.match(/inactive|background/u) && nextAppState === 'active') {
        callback(true, now - statChangeTime)
        statChangeTime = now
      } else if (appState === 'active' && nextAppState.match(/inactive|background/u)) {
        callback(false, now - statChangeTime)
        statChangeTime = now
      }

      appState = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }

export const useAppStateEffect = (callback: (active: boolean, delta: number) => void) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const now = new Date().getTime()
      if (appState.match(/inactive|background/u) && nextAppState === 'active') {
        callback(true, now - statChangeTime)
        statChangeTime = now
      } else if (appState === 'active' && nextAppState.match(/inactive|background/u)) {
        callback(false, now - statChangeTime)
        statChangeTime = now
      }

      appState = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [callback])
}
