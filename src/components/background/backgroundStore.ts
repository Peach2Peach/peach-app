import { ViewStyle } from 'react-native'
import create from 'zustand'

export type BackgroundConfig = {
  color?: 'primaryGradient' | ViewStyle
}

type BackgroundState = BackgroundConfig & {
  setBackgroundState: (backgroundConfig: Partial<BackgroundConfig>) => void
}

const defaultState: BackgroundConfig = {
  color: undefined,
}

export const useBackgroundState = create<BackgroundState>()((set) => ({
  ...defaultState,
  setBackgroundState: (backgroundConfig) => set({ ...defaultState, ...backgroundConfig }),
}))
