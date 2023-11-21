import { useConfigStore } from '../store/configStore/configStore'
import { usePaymentDataStore } from '../store/usePaymentDataStore'
import { getPeachInfo } from './getPeachInfo'
import { storePeachInfo } from './storePeachInfo'

const setPaymentMethodsMock = jest.fn()
jest.mock('../paymentMethods', () => ({
  ...jest.requireActual('../paymentMethods'),
  setPaymentMethods: (...args: unknown[]) => setPaymentMethodsMock(...args),
}))
const getInfoMock = jest.fn()
jest.mock('../utils/peachAPI', () => ({
  getInfo: () => getInfoMock(),
}))
const calculateClientServerTimeDifferenceMock = jest.fn()
jest.mock('./calculateClientServerTimeDifference', () => ({
  calculateClientServerTimeDifference: () => calculateClientServerTimeDifferenceMock(),
}))

jest.mock('./storePeachInfo')

// eslint-disable-next-line max-lines-per-function
describe('getPeachInfo', () => {
  const paymentMethods: PaymentMethodInfo[] = [
    {
      id: 'sepa',
      currencies: ['EUR'],
      anonymous: false,
    },
  ]
  beforeEach(() => {
    const useConfigStoreHydrated = jest.spyOn(useConfigStore.persist, 'hasHydrated')
    const usePaymentDataStoreHydrated = jest.spyOn(usePaymentDataStore.persist, 'hasHydrated')

    useConfigStoreHydrated.mockReturnValue(true)
    usePaymentDataStoreHydrated.mockReturnValue(true)

    useConfigStore.setState({ paymentMethods })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns error response when server is not available', async () => {
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce(undefined)

    const response = await getPeachInfo()

    expect(response).toEqual(undefined)
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods)
    expect(storePeachInfo).not.toHaveBeenCalled()
  })

  it('returns status response when getInfo returns an error', async () => {
    const errorResponse = { error: 'error message' }
    getInfoMock.mockResolvedValueOnce([null, { error: errorResponse }])

    const response = await getPeachInfo()

    expect(response).toEqual(undefined)
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods)
    expect(storePeachInfo).not.toHaveBeenCalled()
  })

  it('stores peach info when getInfo returns a successful response', async () => {
    const serverStatus = {
      error: null,
      status: 'online',
      serverTime: Date.now(),
    }
    const infoResponse = { info: 'info message' }
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce([serverStatus, null])
    getInfoMock.mockResolvedValueOnce([infoResponse, null])

    const response = await getPeachInfo()

    expect(response).toEqual([serverStatus, null])
    expect(storePeachInfo).toHaveBeenCalledWith(infoResponse)
  })
  it('updates payment method from store if getInfo does not return a successful response', async () => {
    const serverStatus = {
      error: null,
      status: 'online',
      serverTime: Date.now(),
    }
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce([serverStatus, null])
    getInfoMock.mockResolvedValueOnce([null, { error: true }])

    const response = await getPeachInfo()

    expect(response).toEqual([serverStatus, null])
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods)
    expect(storePeachInfo).not.toHaveBeenCalled()
  })
})
