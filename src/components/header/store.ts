import create from 'zustand'

type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: { iconComponent: JSX.Element; onPress: () => void }[]
  hideGoBackButton?: boolean
}

type HeaderState = HeaderConfig & {
  setHeaderState: (headerConfiguration: HeaderConfig) => void
}

const defaultState = {
  title: '',
  titleComponent: undefined,
  icons: [],
  hideGoBackButton: false,
}

export const useHeaderState = create<HeaderState>()((set) => ({
  ...defaultState,
  setHeaderState: (props) => set({ ...defaultState, ...props }),
}))
