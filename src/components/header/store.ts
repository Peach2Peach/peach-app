import create from 'zustand'

type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: { iconComponent: JSX.Element; onPress: () => void }[]
  showGoBackButton?: boolean
}

type HeaderState = HeaderConfig & {
  setHeaderState: (headerConfiguration: HeaderConfig) => void
}

const defaultState = {
  title: '',
  titleComponent: undefined,
  icons: [],
  showGoBackButton: true,
}

export const useHeaderState = create<HeaderState>()((set) => ({
  ...defaultState,
  setHeaderState: (props) => set({ ...defaultState, ...props }),
}))
