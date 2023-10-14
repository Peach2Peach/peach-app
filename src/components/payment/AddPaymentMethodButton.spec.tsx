import { fireEvent, render, waitFor } from 'test-utils'
import { balticHoneyBadger, belgianBTCEmbassy, breizhBitcoin, decouvreBTC } from '../../../tests/unit/data/eventData'
import { navigateMock, pushMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import { defaultState, useDrawerState } from '../drawer/useDrawerState'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))

const mockEvents: MeetupEvent[] = [belgianBTCEmbassy, decouvreBTC]

const getMeetupEventsMock = jest.fn(
  (): Promise<[MeetupEvent[] | null, APIError | null]> => Promise.resolve([mockEvents, null]),
)
jest.mock('../../utils/peachAPI/public/meetupEvents', () => ({
  getMeetupEvents: () => getMeetupEventsMock(),
}))

jest.useFakeTimers()

describe('AddPaymentMethodButton', () => {
  beforeEach(() => {
    useMeetupEventsStore.getState().setMeetupEvents([])
  })
  afterEach(() => {
    queryClient.clear()
  })

  it('should render correctly', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash={false} />)
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />)
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
      jest.advanceTimersByTime(1000)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash while still loading', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />)
    expect(toJSON()).toMatchSnapshot()
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
  })

  it('should not update the drawer if meetupEvents are undefined', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([null, { error: 'error' }])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('error')
    })
    fireEvent.press(getByText('add new cash option'))
    expect(useDrawerState.getState()).toStrictEqual(expect.objectContaining(defaultState))
  })

  it('should update the drawer with the right parameters for cash trades', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
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

  it('should show the meetup select drawer after selecting a country', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
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

  it('should navigate to the meetupScreen with the right parameters', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
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
  it('should sort the countries alphabetically and keep super featured events on top', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([[...mockEvents, balticHoneyBadger], null])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([...mockEvents, balticHoneyBadger])
    })
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
  it('should sort the meetups by their city alphabetically', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([[breizhBitcoin, ...mockEvents], null])

    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([breizhBitcoin, ...mockEvents])
    })
    fireEvent.press(getByText('add new cash option'))

    const onPress = useDrawerState.getState().options.find((e) => e.title === 'France')?.onPress
    onPress?.()

    expect(useDrawerState.getState().options).toStrictEqual([
      { highlighted: false, onPress: expect.any(Function), subtext: decouvreBTC.city, title: decouvreBTC.longName },
      { highlighted: false, onPress: expect.any(Function), subtext: breizhBitcoin.city, title: breizhBitcoin.longName },
    ])
  })

  it('should show the featured meetups at the top of the list', async () => {
    const featuredEvent: MeetupEvent = {
      ...breizhBitcoin,
      featured: true,
    }
    getMeetupEventsMock.mockResolvedValueOnce([[decouvreBTC, featuredEvent], null])
    expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />)
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([decouvreBTC, featuredEvent])
    })
    fireEvent.press(getByText('add new cash option'))

    const onPress = useDrawerState.getState().options.find((e) => e.title === 'France')?.onPress
    onPress?.()

    expect(useDrawerState.getState().options).toStrictEqual([
      { highlighted: false, onPress: expect.any(Function), subtext: decouvreBTC.city, title: decouvreBTC.longName },
      { highlighted: true, onPress: expect.any(Function), subtext: featuredEvent.city, title: featuredEvent.longName },
    ])
  })
})
