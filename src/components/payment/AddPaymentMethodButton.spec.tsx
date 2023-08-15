import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { balticHoneyBadger, belgianBTCEmbassy, breizhBitcoin, decouvreBTC } from '../../../tests/unit/data/eventData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock, pushMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { DrawerContext, defaultState } from '../../contexts/drawer'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
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
  const onCloseMock = jest.fn()
  let drawer = { ...defaultState, onClose: onCloseMock }

  const updateDrawer = jest.fn((newDrawer) => {
    drawer = { ...drawer, ...newDrawer }
  })
  const DrawerContextWrapper = ({ children }: { children: JSX.Element }) => (
    <DrawerContext.Provider value={[drawer, updateDrawer]}>{children}</DrawerContext.Provider>
  )

  const wrapper = ({ children }: { children: JSX.Element }) => (
    <DrawerContextWrapper>
      <NavigationAndQueryClientWrapper>{children}</NavigationAndQueryClientWrapper>
    </DrawerContextWrapper>
  )

  beforeEach(() => {
    useMeetupEventsStore.getState().setMeetupEvents([])
  })
  afterEach(() => {
    queryClient.clear()
  })

  it('should render correctly', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash={false} />, { wrapper })
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />, { wrapper })
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
      jest.advanceTimersByTime(1000)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash while still loading', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
  })

  it('should not update the drawer if meetupEvents are undefined', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([null, { error: 'error' }])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('error')
    })
    fireEvent.press(getByText('add new cash option'))
    expect(updateDrawer).not.toHaveBeenCalled()
  })

  it('should update the drawer with the right parameters for cash trades', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.title).toBe('select country')
    expect(drawer.show).toBe(true)
    expect(drawer.options).toStrictEqual([
      { flagID: 'BE', onPress: expect.any(Function), title: 'Belgium' },
      { flagID: 'FR', onPress: expect.any(Function), title: 'France' },
    ])
  })

  it('should show the meetup select drawer after selecting a country', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    drawer.options.find((e) => e.title === 'Belgium')?.onPress()

    expect(drawer.title).toBe('select meetup')
    expect(drawer.show).toBe(true)
    expect(drawer.options).toStrictEqual([
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Antwerp',
        title: 'Belgian Bitcoin Embassy',
      },
    ])
    expect(drawer.previousDrawer?.title).toBe('select country')
    expect(drawer.previousDrawer?.show).toBe(true)
    expect(drawer.previousDrawer?.options).toStrictEqual([
      { flagID: 'BE', onPress: expect.any(Function), title: 'Belgium' },
      { flagID: 'FR', onPress: expect.any(Function), title: 'France' },
    ])
  })

  it('should navigate to the meetupScreen with the right parameters', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    drawer.options.find((e) => e.title === 'Belgium')?.onPress()
    drawer.options.find((e) => e.title === belgianBTCEmbassy.longName)?.onPress()

    expect(drawer.show).toBe(false)
    expect(pushMock).toHaveBeenCalledWith('meetupScreen', {
      eventId: belgianBTCEmbassy.id,
      origin: 'paymentMethods',
    })
  })
  it('should navigate to the addPaymentMethod screen with the right parameters for isCash false', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={false} />, { wrapper })
    fireEvent.press(getByText('add new currency /\npayment method'))
    expect(navigateMock).toHaveBeenCalledWith('selectCurrency', {
      origin: 'paymentMethods',
    })
  })
  it('should sort the countries alphabetically and keep super featured events on top', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([[...mockEvents, balticHoneyBadger], null])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([...mockEvents, balticHoneyBadger])
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.options).toStrictEqual([
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

    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([breizhBitcoin, ...mockEvents])
    })
    fireEvent.press(getByText('add new cash option'))

    drawer.options.find((e) => e.title === 'France')?.onPress()
    expect(drawer.options).toStrictEqual([
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
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(useMeetupEventsStore.getState().meetupEvents).toStrictEqual([decouvreBTC, featuredEvent])
    })
    fireEvent.press(getByText('add new cash option'))

    drawer.options.find((e) => e.title === 'France')?.onPress()
    expect(drawer.options).toStrictEqual([
      { highlighted: false, onPress: expect.any(Function), subtext: decouvreBTC.city, title: decouvreBTC.longName },
      { highlighted: true, onPress: expect.any(Function), subtext: featuredEvent.city, title: featuredEvent.longName },
    ])
  })
})
