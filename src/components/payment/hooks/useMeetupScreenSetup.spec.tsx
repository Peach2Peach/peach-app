import { NavigationContainer } from '@react-navigation/native'
import { act, renderHook } from '@testing-library/react-native'
import { setPaymentMethods } from '../../../constants'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { usePopupStore } from '../../../store/usePopupStore'
import { account, defaultAccount, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { useHeaderState } from '../../header/store'
import { useMeetupScreenSetup } from './useMeetupScreenSetup'
import { meetupEventsStore } from '../../../store/meetupEventsStore'

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
        currencies: [],
        id: '123',
        longName: '',
        shortName: '',
      },
      deletable: true,
      addToPaymentMethods: expect.any(Function),
      paymentMethod: 'cash.123',
      onCurrencyToggle: expect.any(Function),
      selectedCurrencies: [],
    })
  })
  it('should set up the header correctly', () => {
    renderHook(useMeetupScreenSetup, {
      wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer>,
    })

    expect(useHeaderState.getState().title).toBe('')
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[0].color).toBe('#099DE2')
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1].id).toBe('trash')
    expect(useHeaderState.getState().icons?.[1].color).toBe('#DF321F')
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
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[0].color).toBe('#099DE2')
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1]).toBeUndefined()
  })

  it('should add a meetup to the payment methods', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    meetupEventsStore.getState().setMeetupEvents([
      {
        id: '123',
        currencies: ['EUR'],
        country: 'DE',
        city: 'Berlin',
        shortName: 'shortName',
        longName: 'longName',
      },
    ])
    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    result.current.addToPaymentMethods()
    expect(account.paymentData).toStrictEqual([
      {
        id: 'cash.123',
        currencies: ['EUR'],
        country: 'DE',
        label: 'shortName',
        type: 'cash.123',
        userId: '',
      },
    ])
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should show the delete payment method popup', () => {
    renderHook(useMeetupScreenSetup, { wrapper: NavigationContainer })

    useHeaderState.getState().icons?.[1].onPress()
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
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
  it('should select all currencies by default', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    meetupEventsStore.getState().setMeetupEvents([
      {
        id: '123',
        currencies: ['EUR', 'CHF'],
        country: 'DE',
        city: 'Berlin',
        shortName: 'shortName',
        longName: 'longName',
      },
    ])

    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    expect(result.current.selectedCurrencies).toStrictEqual(['EUR', 'CHF'])
  })

  it('should update the selected currencies', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    meetupEventsStore.getState().setMeetupEvents([
      {
        id: '123',
        currencies: ['EUR', 'CHF'],
        country: 'DE',
        city: 'Berlin',
        shortName: 'shortName',
        longName: 'longName',
      },
    ])

    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    act(() => {
      result.current.onCurrencyToggle('CHF')
    })
    expect(result.current.selectedCurrencies).toStrictEqual(['EUR'])
    act(() => {
      result.current.onCurrencyToggle('CHF')
    })
    expect(result.current.selectedCurrencies).toStrictEqual(['EUR', 'CHF'])
  })
  it('should use empty array as fallback if event has no currencies', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    meetupEventsStore.getState().setMeetupEvents([
      {
        id: '123',
        currencies: [],
        country: 'DE',
        city: 'Berlin',
        shortName: 'shortName',
        longName: 'longName',
      },
    ])

    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    expect(result.current.selectedCurrencies).toStrictEqual([])
  })
  it('should add the payment method to the account with only the selected currencies', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    meetupEventsStore.getState().setMeetupEvents([
      {
        id: '123',
        currencies: ['EUR', 'CHF'],
        country: 'DE',
        city: 'Berlin',
        shortName: 'shortName',
        longName: 'longName',
      },
    ])

    const { result } = renderHook(useMeetupScreenSetup, {
      wrapper: NavigationContainer,
    })

    act(() => {
      result.current.onCurrencyToggle('EUR')
    })
    act(() => {
      result.current.addToPaymentMethods()
    })
    expect(account.paymentData).toStrictEqual([
      {
        id: 'cash.123',
        currencies: ['CHF'],
        country: 'DE',
        label: 'shortName',
        type: 'cash.123',
        userId: '',
      },
    ])
  })
})
