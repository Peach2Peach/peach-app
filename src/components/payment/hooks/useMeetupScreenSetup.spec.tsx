import { useMeetupScreenSetup } from './useMeetupScreenSetup'
import { renderHook } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { HelpIcon } from '../../icons'
import { useHeaderState } from '../../header/store'
import { DeleteIcon } from '../../icons/DeleteIcon'
import { Linking } from 'react-native'
import { setPaymentMethods } from '../../../constants'
import { account, defaultAccount, setAccount } from '../../../utils/account'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { DeletePaymentMethodConfirm } from '../../../overlays/info/DeletePaymentMethodConfirm'
import i18n from '../../../utils/i18n'

const useRouteMock = jest.fn(() => ({
  params: {
    eventId: '123',
    deletable: true,
    origin: 'origin',
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))
const goBackMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(() => ({
    goBack: goBackMock,
    getState: jest.fn(() => ({
      routes: [
        {
          name: 'origin',
        },
        {
          name: 'meetupScreen',
        },
      ],
    })),
  })),
}))

describe('useMeetupScreenSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setPaymentMethods([])
    setAccount(defaultAccount)
  })
  it('should return the correct values', () => {
    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    expect(result.current).toStrictEqual({
      event: {
        city: '',
        country: 'DE',
        id: '123',
        longName: '',
        shortName: '',
      },
      openLink: expect.any(Function),
      deletable: true,
      addToPaymentMethods: expect.any(Function),
    })
  })
  it('should set up the header correctly', () => {
    renderHook(useMeetupScreenSetup, {
      wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer>,
    })

    expect(useHeaderState.getState().title).toBe('')
    expect(useHeaderState.getState().icons?.[0].iconComponent.type).toBe(HelpIcon)
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1].iconComponent.type).toBe(DeleteIcon)
    expect(useHeaderState.getState().icons?.[1].onPress).toBeInstanceOf(Function)
  })
  it('should set up the header correctly when deletable is undefined', () => {
    useRouteMock.mockReturnValueOnce({
      // @ts-expect-error
      params: {
        eventId: '123',
        origin: 'origin',
      },
    })
    renderHook(useMeetupScreenSetup, {
      wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer>,
    })

    expect(useHeaderState.getState().title).toBe('')
    expect(useHeaderState.getState().icons?.[0].iconComponent.type).toBe(HelpIcon)
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1]).toBeUndefined()
  })
  it('should open a link', () => {
    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    result.current.openLink('https://www.google.com')
    expect(Linking.openURL).toHaveBeenCalledWith('https://www.google.com')
  })
  it('shouldn\'t try to open a link if the url is falsy', () => {
    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    result.current.openLink('')
    expect(Linking.openURL).not.toHaveBeenCalled()
  })
  it('should add a meetup to the payment methods', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    result.current.addToPaymentMethods()
    expect(account.paymentData).toStrictEqual([
      {
        id: 'cash.123',
        currencies: ['EUR'],
        country: 'DE',
        label: '',
        type: 'cash.123',
        userId: '',
      },
    ])
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should show the delete payment method overlay', () => {
    let overlay = defaultOverlay
    const updateOverlay = jest.fn((newOverlay) => {
      overlay = newOverlay
    })

    renderHook(useMeetupScreenSetup, {
      wrapper: ({ children }) => (
        <NavigationContainer>
          <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
        </NavigationContainer>
      ),
    })

    useHeaderState.getState().icons?.[1].onPress()
    expect(overlay).toStrictEqual({
      title: i18n('help.paymentMethodDelete.title'),
      content: <DeletePaymentMethodConfirm />,
      visible: true,
      level: 'ERROR',
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: expect.any(Function),
        icon: 'trash',
        label: i18n('delete'),
      },
    })
  })
})
