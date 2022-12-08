import create from 'zustand'
import { IconType } from '../icons'

type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: { iconId: IconType; onPress: () => void }[]
  showGoBackButton?: boolean
}

type HeaderState = HeaderConfig & {
  setHeaderState: (headerConfiguration: HeaderConfig) => void
}

const defaultState = {
  title: '',
  titleComponent: undefined,
  icons: [],
  showGoBackButton: false,
}

export const useHeaderState = create<HeaderState>()((set) => ({
  ...defaultState,
  setHeaderState: (props) => set({ ...defaultState, ...props }),
}))
