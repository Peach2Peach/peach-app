import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { MeetupScreen } from './MeetupScreen'
import { createRenderer } from 'react-test-renderer/shallow'

const useMeetupScreenSetupMock = jest.fn().mockReturnValue({
  event: {
    id: 'ch.lausanne.lausanne-btc',
    country: 'CH',
    city: 'Lausanne',
    shortName: 'Lausanne BTC',
    longName: 'Lausanne Bitcoin',
    url: 'https://bitcoinlausanne.ch',
    frequency: '1st Wednesday of the month',
    logo: '/v1/events/logo/laussane.png',
  },
  openLink: jest.fn(),
  deletable: false,
  addToPaymentMethods: jest.fn(),
})
jest.mock('./hooks/useMeetupScreenSetup', () => ({
  useMeetupScreenSetup: () => useMeetupScreenSetupMock(),
}))

describe('MeetupScreen', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly', () => {
    shallowRenderer.render(<MeetupScreen />, { wrapper: NavigationWrapper })
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
