import { ColorValue, ViewStyle } from 'react-native'
import { create } from 'zustand'
import { IconType } from '../../assets/icons'

export type HeaderIcon = {
  id: IconType
  style?: ViewStyle | ViewStyle[]
  color?: ColorValue | undefined
  onPress: () => void
}
export type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: HeaderIcon[]
  hideGoBackButton?: boolean
  theme?: 'default' | 'inverted'
}

type HeaderState = HeaderConfig & {
  setHeaderState: (headerConfiguration: Partial<HeaderConfig>) => void
}

const defaultState: HeaderConfig = {
  title: '',
  titleComponent: undefined,
  icons: [],
  hideGoBackButton: false,
  theme: 'default',
}

export const useHeaderState = create<HeaderState>()((set) => ({
  ...defaultState,
  setHeaderState: (headerConfiguration) => set({ ...defaultState, ...headerConfiguration }),
}))
