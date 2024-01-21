import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import {
  getStateMock,
  goBackMock,
  meetupScreenRoute,
  setRouteMock,
} from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { setPaymentMethods } from '../../../paymentMethods'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { defaultPaymentDataStore } from '../../../store/usePaymentDataStore/usePaymentDataStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useMeetupScreenSetup } from './useMeetupScreenSetup'

getStateMock.mockReturnValue({
  routes: [
    {
      name: 'matchDetails',
      key: 'matchDetails',
    },
    {
      key: 'meetupScreen',
      name: 'meetupScreen',
    },
  ],
  index: 1,
  key: 'key',
  routeNames: ['matchDetails', 'meetupScreen'],
  type: 'stack',
  stale: false,
})

const defaultEvent: MeetupEvent = {
  id: '123',
  currencies: ['EUR'],
  country: 'DE',
  city: 'Berlin',
  shortName: 'shortName',
  longName: 'longName',
  featured: false,
}
const getEventsMock = jest
  .spyOn(peachAPI.public.events, 'getEvents')
  .mockResolvedValue({ result: [defaultEvent], ...responseUtils })

jest.useFakeTimers()

describe('useMeetupScreenSetup', () => {
  beforeAll(() => {
    setRouteMock({ ...meetupScreenRoute, params: { eventId: '123', deletable: true, origin: 'matchDetails' } })
  })
  beforeEach(() => {
    setPaymentMethods([])
    usePaymentDataStore.setState(defaultPaymentDataStore)
  })
  afterEach(() => {
    queryClient.clear()
  })
  it('should return the correct values', () => {
    const { result } = renderHook(useMeetupScreenSetup)

    expect(result.current).toStrictEqual({
      event: {
        city: '',
        country: 'DE',
        currencies: [],
        id: '123',
        longName: '',
        shortName: '',
        featured: false,
      },
      deletable: true,
      addToPaymentMethods: expect.any(Function),
      paymentMethod: 'cash.123',
      onCurrencyToggle: expect.any(Function),
      selectedCurrencies: [],
    })
  })

  it('should add a meetup to the payment methods', async () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    result.current.addToPaymentMethods()
    expect(usePaymentDataStore.getState().getPaymentData('cash.123')).toStrictEqual({
      id: 'cash.123',
      currencies: ['EUR'],
      country: 'DE',
      label: 'shortName',
      type: 'cash.123',
      userId: '',
    })
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should not add a meetup to the payment methods if the meetupInfo isnt available', async () => {
    setRouteMock({ ...meetupScreenRoute, params: { eventId: 'someUnknownId', deletable: true, origin: 'matchDetails' } })
    getEventsMock.mockResolvedValueOnce({ result: [], ...responseUtils })
    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    result.current.addToPaymentMethods()
    expect(usePaymentDataStore.getState().paymentData).toStrictEqual(defaultPaymentDataStore.paymentData)
    expect(goBackMock).not.toHaveBeenCalled()
    setRouteMock({ ...meetupScreenRoute, params: { eventId: '123', deletable: true, origin: 'matchDetails' } })
  })
  it('should automatically add the meetup to the selected methods', async () => {
    useOfferPreferences.getState().setPaymentMethods([])
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR'], anonymous: true }])
    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
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
            hashes: [],
          },
        },
        preferredPaymentMethods: {
          'cash.123': 'cash.123',
        },
      }),
    )
  })

  it('should select all currencies by default', async () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    getEventsMock.mockResolvedValueOnce({ result: [{ ...defaultEvent, currencies: ['EUR', 'CHF'] }], ...responseUtils })

    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(result.current.selectedCurrencies).toStrictEqual(['EUR', 'CHF'])
  })

  it('should update the selected currencies', async () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    getEventsMock.mockResolvedValueOnce({ result: [{ ...defaultEvent, currencies: ['EUR', 'CHF'] }], ...responseUtils })

    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
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
  it('should use empty array as fallback if event has no currencies', async () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    getEventsMock.mockResolvedValueOnce({ result: [{ ...defaultEvent, currencies: [] }], ...responseUtils })

    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(result.current.selectedCurrencies).toStrictEqual([])
  })
  it('should add the payment method to the account with only the selected currencies', async () => {
    setPaymentMethods([{ id: 'cash.123', currencies: ['EUR', 'CHF'], anonymous: true }])
    getEventsMock.mockResolvedValueOnce({ result: [{ ...defaultEvent, currencies: ['EUR', 'CHF'] }], ...responseUtils })

    const { result } = renderHook(useMeetupScreenSetup)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    act(() => {
      result.current.onCurrencyToggle('EUR')
    })
    act(() => {
      result.current.addToPaymentMethods()
    })
    expect(usePaymentDataStore.getState().getPaymentData('cash.123')).toStrictEqual({
      id: 'cash.123',
      currencies: ['CHF'],
      country: 'DE',
      label: 'shortName',
      type: 'cash.123',
      userId: '',
    })
  })
})
