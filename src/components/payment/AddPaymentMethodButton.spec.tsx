import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, pushMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient, QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { DrawerContext } from '../../contexts/drawer'
import { meetupEventsStore } from '../../store/meetupEventsStore'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))

const getMeetupEventsMock = jest.fn((): Promise<[MeetupEvent[] | null, APIError | null]> => Promise.resolve([[], null]))
jest.mock('../../utils/peachAPI/public/meetupEvents', () => ({
  getMeetupEvents: () => getMeetupEventsMock(),
}))

describe('AddPaymentMethodButton', () => {
  const onCloseMock = jest.fn()
  let drawer: DrawerState = {
    title: '',
    content: <></>,
    show: false,
    previousDrawer: {},
    onClose: onCloseMock,
  }

  const updateDrawer = jest.fn((newDrawer) => {
    drawer = newDrawer
  })
  const DrawerContextWrapper = ({ children }: { children: JSX.Element }) => (
    // @ts-ignore
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
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with isCash', async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
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
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: false,
        },
      ],
      null,
    ])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    expect(drawer.title).toBe('select country')
    expect(drawer.show).toBe(true)
    expect(drawer.content).toMatchSnapshot()
  })

  it('should show the meetup select drawer after selecting a country', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: false,
        },
      ],
      null,
    ])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))

    const { getByText: getByText2 } = render(drawer.content)
    fireEvent.press(getByText2('Germany'))
    expect(drawer.title).toBe('select meetup')
    expect(drawer.show).toBe(true)
    expect(drawer.content).toMatchSnapshot('drawer\'s content')
    expect(drawer.previousDrawer.title).toBe('select country')
    expect(drawer.previousDrawer.show).toBe(true)
    expect(drawer.previousDrawer.content).toMatchSnapshot('previousDrawer\'s content')
  })

  it('should navigate to the meetupScreen with the right parameters', () => {
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: false,
        },
      ],
      null,
    ])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    const { getByText: getByText2 } = render(drawer.content)
    fireEvent.press(getByText2('Germany'))
    const { getByText: getByText3 } = render(drawer.content)
    fireEvent.press(getByText3('EINUNDZWANZIG BTC'))
    expect(drawer).toStrictEqual({
      show: false,
    })
    expect(pushMock).toHaveBeenCalledWith('meetupScreen', {
      eventId: '1',
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
  it('should sort the meetups alphabetically', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: false,
        },
        {
          id: '2',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Aachen',
          shortName: '22BTC',
          longName: 'ZWEIUNDZWANZIG BTC',
          featured: false,
        },
      ],
      null,
    ])
    expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    act(() => {
      queryClient.invalidateQueries(['meetupEvents'])
      queryClient.refetchQueries(['meetupEvents'])
    })
    expect(getMeetupEventsMock).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: false,
        },
        {
          id: '2',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Aachen',
          shortName: '22BTC',
          longName: 'ZWEIUNDZWANZIG BTC',
          featured: false,
        },
      ])
    })
    fireEvent.press(getByText('add new cash option'))
    const { getByText: getByText2 } = render(drawer.content)
    fireEvent.press(getByText2('Germany'))
    expect(drawer.content).toMatchSnapshot()
  })

  it('should show the featured meetups at the top of the list', async () => {
    getMeetupEventsMock.mockResolvedValueOnce([
      [
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: true,
        },
        {
          id: '2',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Aachen',
          shortName: '22BTC',
          longName: 'ZWEIUNDZWANZIG BTC',
          featured: false,
        },
      ],
      null,
    ])
    expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([])
    const { getByText } = render(<AddPaymentMethodButton isCash={true} />, { wrapper })
    act(() => {
      queryClient.invalidateQueries(['meetupEvents'])
      queryClient.refetchQueries(['meetupEvents'])
    })
    expect(getMeetupEventsMock).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(meetupEventsStore.getState().meetupEvents).toStrictEqual([
        {
          id: '1',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Berlin',
          shortName: '21BTC',
          longName: 'EINUNDZWANZIG BTC',
          featured: true,
        },
        {
          id: '2',
          currencies: ['EUR'],
          country: 'DE',
          city: 'Aachen',
          shortName: '22BTC',
          longName: 'ZWEIUNDZWANZIG BTC',
          featured: false,
        },
      ])
    })
    await waitFor(() => {
      expect(queryClient.getQueryState(['meetupEvents'])?.status).toBe('success')
    })
    fireEvent.press(getByText('add new cash option'))
    const { getByText: getByText2 } = render(drawer.content)
    fireEvent.press(getByText2('Germany'))
    expect(drawer.content).toMatchSnapshot()
  })
})
