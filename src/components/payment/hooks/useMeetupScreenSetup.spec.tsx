import { NavigationContainer } from '@react-navigation/native'
import { act, renderHook } from '@testing-library/react-native'
import { headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { setPaymentMethods } from '../../../constants'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePopupStore } from '../../../store/usePopupStore'
import { account, defaultAccount, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { useMeetupScreenSetup } from './useMeetupScreenSetup'

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
    setOptions: setOptionsMock,
  })),
}))

describe('useMeetupScreenSetup', () => {
  beforeEach(() => {
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
      wrapper: NavigationContainer,
    })

    expect(headerState.header()).toMatchSnapshot()
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
      wrapper: NavigationContainer,
    })

    expect(headerState.header()).toMatchSnapshot()
  })

  it('should add a meetup to the payment methods', () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    useMeetupEventsStore.getState().setMeetupEvents([
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
  it('should automatically add the meetup to the selected methods', () => {
    useOfferPreferences.getState().setPaymentMethods([])
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    useMeetupEventsStore.getState().setMeetupEvents([
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

    expect(useOfferPreferences.getState().preferredPaymentMethods).toStrictEqual({})
    act(() => {
      result.current.addToPaymentMethods()
    })
    expect(useOfferPreferences.getState()).toStrictEqual(
      expect.objectContaining({
        meansOfPayment: {
          EUR: ['cash.123'],
        },
        originalPaymentData: [
          {
            country: 'DE',
            currencies: ['EUR'],
            id: 'cash.123',
            label: 'shortName',
            type: 'cash.123',
            userId: '',
          },
        ],
        paymentData: {
          'cash.123': {
            country: 'DE',
            hash: '271c06de9309a4262c2fd1c77bda4c56efd105579ade0217897f8fdb161ff8ba',
          },
        },
        preferredPaymentMethods: {
          'cash.123': 'cash.123',
        },
      }),
    )
  })
  it('should show the delete payment method popup', () => {
    renderHook(useMeetupScreenSetup, { wrapper: NavigationContainer })

    headerState.header()?.props.icons[1].onPress()
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
    useMeetupEventsStore.getState().setMeetupEvents([
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
    useMeetupEventsStore.getState().setMeetupEvents([
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
    useMeetupEventsStore.getState().setMeetupEvents([
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
    useMeetupEventsStore.getState().setMeetupEvents([
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
