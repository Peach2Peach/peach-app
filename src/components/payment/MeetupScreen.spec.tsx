import { Linking } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render, waitFor } from 'test-utils'
import { meetupScreenRoute, setRouteMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { setPaymentMethods } from '../../paymentMethods'
import { MeetupScreen } from './MeetupScreen'

const meetupScreenSetup = {
  openLink: jest.fn(),
  deletable: false,
  addToPaymentMethods: jest.fn(),
  onCurrencyToggle: jest.fn(),
}
const useMeetupScreenSetupMock = jest.fn().mockReturnValue({
  ...meetupScreenSetup,
  paymentMethod: 'cash.pt.porto.portugal-norte-bitcoin',
  event: {
    id: 'pt.porto.portugal-norte-bitcoin',
    currencies: ['EUR'],
    countries: ['PT'],
  },
  selectedCurrencies: ['EUR'],
})
jest.mock('./hooks/useMeetupScreenSetup', () => ({
  useMeetupScreenSetup: () => useMeetupScreenSetupMock(),
}))

jest.useFakeTimers()

describe('MeetupScreen', () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')
  const renderer = createRenderer()
  const btcPragueEvent = {
    id: 'cash.cz.prague.btc-prague',
    currencies: ['CZK', 'EUR'],
    countries: ['CZ'],
    address: 'Prague',
    url: 'https://peachbitcoin.com/',
  }
  beforeAll(() => {
    setPaymentMethods([
      {
        id: 'cash.pt.porto.portugal-norte-bitcoin',
        currencies: ['EUR'],
        countries: ['PT'],
        rounded: true,
        anonymous: true,
      },
      {
        id: 'cash.cz.prague.btc-prague',
        currencies: ['CZK', 'EUR'],
        countries: ['CZ'],
        rounded: true,
        anonymous: true,
      },
    ])
    setRouteMock(meetupScreenRoute)
  })
  it('should render correctly', () => {
    renderer.render(<MeetupScreen />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly with multiple currencies', () => {
    useMeetupScreenSetupMock.mockReturnValueOnce({
      ...meetupScreenSetup,
      deletable: true,
      paymentMethod: 'cash.cz.prague.btc-prague',
      event: btcPragueEvent,
      selectedCurrencies: ['EUR'],
    })
    renderer.render(<MeetupScreen />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should open link to google maps and meetup website', async () => {
    useMeetupScreenSetupMock.mockReturnValueOnce({
      ...meetupScreenSetup,
      deletable: true,
      paymentMethod: 'cash.cz.prague.btc-prague',
      event: btcPragueEvent,
      selectedCurrencies: ['EUR'],
    })
    const { getByText } = render(<MeetupScreen />)
    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    await fireEvent(getByText('view on maps'), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith('http://maps.google.com/maps?daddr=Prague')
    await fireEvent(getByText('meetup link'), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith(btcPragueEvent.url)
  })
})
