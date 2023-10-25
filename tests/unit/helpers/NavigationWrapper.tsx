import { NavigationContext } from '@react-navigation/native'

export const navigateMock = jest.fn()
export const replaceMock = jest.fn()
export const resetMock = jest.fn()
export const pushMock = jest.fn()
export const setParamsMock = jest.fn()
export const goBackMock = jest.fn()
export const canGoBackMock = jest.fn()
export const isFocusedMock = jest.fn().mockReturnValue(true)
export const unsubScribeMock = jest.fn()
export const addListenerMock = jest.fn(() => unsubScribeMock)
export let headerState: Record<'header', () => JSX.Element> = {
  header: () => <></>,
}
export const setOptionsMock = jest.fn((options) => {
  headerState = options
})
export const getStateMock = jest.fn(() => ({
  routes: [
    {
      name: 'origin',
    },
    {
      name: 'meetupScreen',
    },
  ],
  index: 1,
}))

export const navigationMock = {
  navigate: navigateMock,
  reset: resetMock,
  setOptions: setOptionsMock,
  replace: replaceMock,
  push: pushMock,
  setParams: setParamsMock,
  goBack: goBackMock,
  canGoBack: canGoBackMock,
  isFocused: isFocusedMock,
  addListener: addListenerMock,
  getState: getStateMock,
}
export const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  // @ts-ignore
  <NavigationContext.Provider value={navigationMock}>{children}</NavigationContext.Provider>
)
