import create from 'zustand'

export type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: { iconComponent: JSX.Element; onPress: () => void }[]
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
