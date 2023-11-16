import { NavigationContext, NavigationState } from '@react-navigation/native'

export const navigateMock = jest.fn()
export const replaceMock = jest.fn()
export const resetMock = jest.fn()
export const pushMock = jest.fn()
export const setParamsMock = jest.fn()
export const goBackMock = jest.fn()
export const canGoBackMock = jest.fn()
const isFocusedMock = jest.fn().mockReturnValue(true)
const unsubscribeMock = jest.fn()
const addListenerMock = jest.fn(() => unsubscribeMock)
const setOptionsMock = jest.fn()
export const getStateMock = jest.fn(
  (): NavigationState => ({
    routes: [
      {
        key: 'origin',
        name: 'origin',
      },
      {
        key: 'meetupScreen',
        name: 'meetupScreen',
      },
    ],
    index: 1,
    key: 'key',
    routeNames: ['home'],
    type: 'stack',
    stale: false,
  }),
)
const dispatchMock = jest.fn()
const getIdMock = jest.fn()
const getParentMock = jest.fn()
const removeListenerMock = jest.fn()

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
  dispatch: dispatchMock,
  getId: getIdMock,
  getParent: getParentMock,
  removeListener: removeListenerMock,
}
export const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContext.Provider value={navigationMock}>{children}</NavigationContext.Provider>
)
