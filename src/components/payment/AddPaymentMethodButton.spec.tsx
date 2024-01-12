import { fireEvent, render } from 'test-utils'
import { balticHoneyBadger, belgianBTCEmbassy, breizhBitcoin, decouvreBTC } from '../../../tests/unit/data/eventData'
import { navigateMock, pushMock, setRouteMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useMeetupEvents } from '../../hooks/query/useMeetupEvents'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import { defaultState, useDrawerState } from '../drawer/useDrawerState'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'

const mockEvents: MeetupEvent[] = [belgianBTCEmbassy, decouvreBTC]

const useMeetupEventsMock = jest.fn(
  (): ReturnType<typeof useMeetupEvents> => ({ meetupEvents: mockEvents, isLoading: false, error: undefined }),
)
jest.mock('../../hooks/query/useMeetupEvents', () => ({
  useMeetupEvents: () => useMeetupEventsMock(),
}))

jest.useFakeTimers()

describe('AddPaymentMethodButton', () => {
  beforeAll(() => {
    setRouteMock({ name: 'paymentMethods', key: 'paymentMethods' })
  })
  beforeEach(() => {
    useMeetupEventsStore.getState().setMeetupEvents([])
  })
  afterEach(() => {
    queryClient.clear()
  })

  it('should render correctly', () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash={false} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash', () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash while still loading', () => {
    // @ts-ignore there is something weird with useMeetupEvents due to initialData
    useMeetupEventsMock.mockReturnValueOnce({ meetupEvents: [], isLoading: true, error: undefined })
    const { toJSON } = render(<AddPaymentMethodButton isCash />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not update the drawer if meetupEvents are undefined', () => {
    useMeetupEventsMock.mockReturnValueOnce({
      meetupEvents: undefined,
      isLoading: false,
      error: { error: 'UNAUTHORIZED' },
    })
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))
    expect(useDrawerState.getState()).toStrictEqual(expect.objectContaining(defaultState))
  })

  it('should update the drawer with the right parameters for cash trades', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))
    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining({
        title: 'select country',
        show: true,
        options: [
          { flagID: 'BE', onPress: expect.any(Function), title: 'Belgium' },
          { flagID: 'FR', onPress: expect.any(Function), title: 'France' },
        ],
      }),
    )
  })

  it('should show the meetup select drawer after selecting a country', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))
    const onPress = useDrawerState.getState().options.find((e) => e.title === 'Belgium')?.onPress
    onPress?.()

    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining({
        title: 'select meetup',
        show: true,
        options: [
          {
            highlighted: false,
            onPress: expect.any(Function),
            subtext: 'Antwerp',
            title: 'Belgian Bitcoin Embassy',
          },
        ],
        previousDrawer: expect.objectContaining({
          title: 'select country',
          show: true,
          options: [
            { flagID: 'BE', onPress: expect.any(Function), title: 'Belgium' },
            { flagID: 'FR', onPress: expect.any(Function), title: 'France' },
          ],
        }),
      }),
    )
  })

  it('should navigate to the meetupScreen with the right parameters', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))
    const onBelgiumPress = useDrawerState.getState().options.find((e) => e.title === 'Belgium')?.onPress
    onBelgiumPress?.()

    const onBelgianBTCEmbassyPress = useDrawerState
      .getState()
      .options.find((e) => e.title === belgianBTCEmbassy.longName)?.onPress
    onBelgianBTCEmbassyPress?.()

    expect(useDrawerState.getState().show).toBe(false)
    expect(pushMock).toHaveBeenCalledWith('meetupScreen', {
      eventId: belgianBTCEmbassy.id,
      origin: 'paymentMethods',
    })
  })
  it('should navigate to the addPaymentMethod screen with the right parameters for isCash false', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={false} />)
    fireEvent.press(getByText('add new currency /\npayment method'))
    expect(navigateMock).toHaveBeenCalledWith('selectCurrency', {
      origin: 'paymentMethods',
    })
  })
  it('should sort the countries alphabetically and keep super featured events on top', () => {
    useMeetupEventsMock.mockReturnValueOnce({
      meetupEvents: [...mockEvents, balticHoneyBadger],
      isLoading: false,
      error: undefined,
    })
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))
    expect(useDrawerState.getState().options).toStrictEqual([
      {
        highlighted: true,
        onPress: expect.any(Function),
        subtext: 'Riga',
        title: 'Baltic Honeybadger',
      },
      { flagID: 'BE', onPress: expect.any(Function), title: 'Belgium' },
      { flagID: 'FR', onPress: expect.any(Function), title: 'France' },
      { flagID: 'LV', onPress: expect.any(Function), title: 'Latvia' },
    ])
  })
  it('should sort the meetups by their city alphabetically', () => {
    useMeetupEventsMock.mockReturnValueOnce({
      meetupEvents: [breizhBitcoin, ...mockEvents],
      isLoading: false,
      error: undefined,
    })

    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))

    const onPress = useDrawerState.getState().options.find((e) => e.title === 'France')?.onPress
    onPress?.()

    expect(useDrawerState.getState().options).toStrictEqual([
      { highlighted: false, onPress: expect.any(Function), subtext: decouvreBTC.city, title: decouvreBTC.longName },
      { highlighted: false, onPress: expect.any(Function), subtext: breizhBitcoin.city, title: breizhBitcoin.longName },
    ])
  })

  it('should show the featured meetups at the top of the list', () => {
    const featuredEvent: MeetupEvent = {
      ...breizhBitcoin,
      featured: true,
    }
    useMeetupEventsMock.mockReturnValueOnce({
      meetupEvents: [decouvreBTC, featuredEvent],
      isLoading: false,
      error: undefined,
    })
    expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    fireEvent.press(getByText('add new cash option'))

    const onPress = useDrawerState.getState().options.find((e) => e.title === 'France')?.onPress
    onPress?.()

    expect(useDrawerState.getState().options).toStrictEqual([
      { highlighted: true, onPress: expect.any(Function), subtext: featuredEvent.city, title: featuredEvent.longName },
      { highlighted: false, onPress: expect.any(Function), subtext: decouvreBTC.city, title: decouvreBTC.longName },
    ])
  })
})
