import { NavigationContainer } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { setPaymentMethods } from '../../../constants'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { usePopupStore } from '../../../store/usePopupStore'
import { account, defaultAccount, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { useMeetupScreenSetup } from './useMeetupScreenSetup'
import { headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'

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
})
