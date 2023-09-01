import { renderHook } from '@testing-library/react-native'
import { getWebSocket } from '../../../utils/peachAPI/websocket'
import { contractUpdateHandler } from '../eventHandlers/contractUpdateHandler'
import { messageHandler } from '../eventHandlers/messageHandler'
import { useNotificationStore } from '../notificationsStore'
import { MainPage, Props, useFooterSetup } from './useFooterSetup'

const navigationResetMock = jest.fn()
const useNavigationMock = jest.fn().mockReturnValue({
  reset: (...args: unknown[]) => navigationResetMock(...args),
})
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const websocket = getWebSocket()
const useWebsocketContextMock = jest.fn().mockReturnValue({ ...websocket, connected: true })
jest.mock('../../../utils/peachAPI/websocket', () => ({
  ...jest.requireActual('../../../utils/peachAPI/websocket'),
  useWebsocketContext: () => useWebsocketContextMock(),
}))

// eslint-disable-next-line max-lines-per-function
describe('useFooterSetup', () => {
  const setCurrentPageMock = jest.fn()
  const initialProps: Props = { setCurrentPage: setCurrentPageMock }
  const mainPages: MainPage[] = ['home', 'buy', 'sell', 'wallet', 'yourTrades', 'settings']

  it('returns default values correctly', () => {
    const { result } = renderHook(useFooterSetup, { initialProps })

    expect(result.current).toEqual({
      navigate: expect.objectContaining(
        mainPages.reduce((obj, page) => {
          obj[page] = expect.any(Function)
          return obj
        }, {} as any),
      ),
      notifications: 0,
      navTo: expect.any(Function),
    })
  })
  it('returns notifications from store', () => {
    useNotificationStore.getState().setNotifications(10)
    const { result } = renderHook(useFooterSetup, { initialProps })

    expect(result.current.notifications).toBe(10)
  })
  it('navigates to screen and sets current page', () => {
    const { result } = renderHook(useFooterSetup, { initialProps })

    mainPages.forEach((page) => {
      result.current.navTo(page)
      expect(setCurrentPageMock).toHaveBeenCalledWith(page)
      expect(navigationResetMock).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: page }],
      })
    })
  })
  it('navigates to screen and sets current page using navigation mapping', () => {
    const { result } = renderHook(useFooterSetup, { initialProps })

    mainPages.forEach((page) => {
      result.current.navigate[page]()
      expect(setCurrentPageMock).toHaveBeenCalledWith(page)
      expect(navigationResetMock).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: page }],
      })
    })
  })
  it('registers message handlers', () => {
    renderHook(useFooterSetup, { initialProps })
    expect(websocket.listeners.message).toEqual(expect.arrayContaining([contractUpdateHandler, messageHandler]))
  })
  it('does not register message handlers if ws is not connected', () => {
    useWebsocketContextMock.mockReturnValueOnce({ ...websocket, connected: false })

    renderHook(useFooterSetup, { initialProps })
    expect(websocket.listeners.message).toEqual([])
  })
  it('deregisters message handlers if ws gets disconnected', () => {
    useWebsocketContextMock.mockReturnValueOnce({ ...websocket, connected: true })
    const { rerender } = renderHook(useFooterSetup, { initialProps })
    expect(websocket.listeners.message).toEqual(expect.arrayContaining([contractUpdateHandler, messageHandler]))

    useWebsocketContextMock.mockReturnValueOnce({ ...websocket, connected: false })
    rerender(initialProps)

    expect(websocket.listeners.message).toEqual([])
  })
})
