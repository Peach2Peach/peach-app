import create from 'zustand'
import { IconType } from '../icons'

type HeaderState = {
  title?: string
  titleComponent?: JSX.Element
  icons: { iconId: IconType; onPress: () => void }[]
  showGoBackButton: boolean
  setHeaderState: (
    title: string,
    icons: { iconId: IconType; onPress: () => void }[],
    titleComponent?: JSX.Element
  ) => void
}

const defaultState = {
  title: '',
  titleComponent: undefined,
  icons: [],
  showGoBackButton: false,
}

export const useHeaderState = create<HeaderState>()((set) => ({
  ...defaultState,
  setHeaderState: (...props) => set(() => ({ ...defaultState, ...props })),
}))
