import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, pushMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient, QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { defaultState, DrawerContext } from '../../contexts/drawer'
import { meetupEventsStore } from '../../store/meetupEventsStore'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))

const mockEvents: MeetupEvent[] = [
  {
    id: '1',
    currencies: ['EUR'],
    country: 'DE',
    city: 'Aachen',
    shortName: '22BTC',
    longName: 'ZWEIUNDZWANZIG BTC',
    featured: false,
  },
  {
    id: '2',
    currencies: ['EUR'],
    country: 'DE',
    city: 'Berlin',
    shortName: '21BTC',
    longName: 'EINUNDZWANZIG BTC',
    featured: false,
  },
]

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
      <QueryClientWrapper>
        <NavigationWrapper>{children}</NavigationWrapper>
      </QueryClientWrapper>
    </DrawerContextWrapper>
  )

  beforeEach(() => {
    meetupEventsStore.getState().setMeetupEvents([])
  })
  afterEach(() => {
    queryClient.clear()
  })

  it('should render correctly', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash={false} />, { wrapper })
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />, { wrapper })
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toEqual(mockEvents)
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
      {
        flagID: 'DE',
        onPress: expect.any(Function),
        title: 'Germany',
      },
    ])
  })

  it('should show the meetup select drawer after selecting a country', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    drawer.options.find((e) => e.title === 'Germany')?.onPress()

    expect(drawer.title).toBe('select meetup')
    expect(drawer.show).toBe(true)
    expect(drawer.options).toStrictEqual([
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Aachen',
        title: 'ZWEIUNDZWANZIG BTC',
      },
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Berlin',
        title: 'EINUNDZWANZIG BTC',
      },
    ])
    expect(drawer.previousDrawer.title).toBe('select country')
    expect(drawer.previousDrawer.show).toBe(true)
    expect(drawer.previousDrawer.options).toStrictEqual([
      {
        flagID: 'DE',
        onPress: expect.any(Function),
        title: 'Germany',
      },
    ])
  })

  it('should navigate to the meetupScreen with the right parameters', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    drawer.options.find((e) => e.title === 'Germany')?.onPress()
    drawer.options.find((e) => e.title === 'EINUNDZWANZIG BTC')?.onPress()

    expect(drawer.show).toBe(false)
    expect(pushMock).toHaveBeenCalledWith('meetupScreen', {
      eventId: '2',
      origin: 'paymentMethods',
    })
  })
  it('should navigate to the addPaymentMethod screen with the right parameters for isCash false', () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={false} />, { wrapper })
    fireEvent.press(getByText('add new currency /\npayment method'))
    expect(pushMock).toHaveBeenCalledWith('addPaymentMethod', {
      origin: 'paymentMethods',
    })
  })
  it('should sort the countries alphabetically', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        ...mockEvents,
        {
          id: '2',
          currencies: ['EUR'],
          country: 'UK',
          city: 'London',
          shortName: '22BTC',
          longName: 'TWENTYTWO BTC',
          featured: false,
        },
      ],
      null,
    ])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([
        ...mockEvents,
        {
          id: '2',
          currencies: ['EUR'],
          country: 'UK',
          city: 'London',
          shortName: '22BTC',
          longName: 'TWENTYTWO BTC',
          featured: false,
        },
      ])
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.options).toStrictEqual([
      {
        flagID: 'DE',
        onPress: expect.any(Function),
        title: 'Germany',
      },
      {
        flagID: 'UK',
        onPress: expect.any(Function),
        title: 'United Kingdom',
      },
    ])
  })
  it('should sort the meetups alphabetically', async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toStrictEqual(mockEvents)
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.options).toStrictEqual([
      {
        flagID: 'DE',
        onPress: expect.any(Function),
        title: 'Germany',
      },
    ])
    drawer.options.find((e) => e.title === 'Germany')?.onPress()
    expect(drawer.options).toStrictEqual([
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Aachen',
        title: 'ZWEIUNDZWANZIG BTC',
      },
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Berlin',
        title: 'EINUNDZWANZIG BTC',
      },
    ])
  })

  it('should show the featured meetups at the top of the list', async () => {
    const featuredEvent: MeetupEvent = {
      id: '1',
      currencies: ['EUR'],
      country: 'DE',
      city: 'Berlin',
      shortName: '21BTC',
      longName: 'EINUNDZWANZIG BTC',
      featured: true,
    }
    getMeetupEventsMock.mockResolvedValueOnce([[mockEvents[0], featuredEvent], null])
    expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([mockEvents[0], featuredEvent])
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.options).toStrictEqual([
      {
        flagID: 'DE',
        onPress: expect.any(Function),
        title: 'Germany',
      },
    ])
    drawer.options.find((e) => e.title === 'Germany')?.onPress()
    expect(drawer.options).toStrictEqual([
      {
        highlighted: true,
        onPress: expect.any(Function),
        subtext: 'Berlin',
        title: 'EINUNDZWANZIG BTC',
      },
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: 'Aachen',
        title: 'ZWEIUNDZWANZIG BTC',
      },
    ])
  })
})
