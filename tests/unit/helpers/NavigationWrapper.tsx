import { NavigationContext } from '@react-navigation/native'

export const navigateMock = jest.fn()
export const replaceMock = jest.fn()
export const pushMock = jest.fn()
export const goBackMock = jest.fn()
export const isFocusedMock = jest.fn().mockReturnValue(true)
export const unsubScribeMock = jest.fn()
export const addListenerMock = jest.fn(() => unsubScribeMock)

export const NavigationWrapper = ({ children }: any) => (
  <NavigationContext.Provider
    value={{
      navigate: navigateMock,
      // @ts-ignore
      replace: replaceMock,
      push: pushMock,
      goBack: goBackMock,
      isFocused: isFocusedMock,
      addListener: addListenerMock,
    }}
  >
    {children}
  </NavigationContext.Provider>
)
