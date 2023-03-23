import { peachInfo } from '../../tests/unit/data/peachInfoData'
import { storePeachInfo } from './storePeachInfo'

const getStateMock = jest.fn()
jest.mock('../store/configStore', () => ({
  configStore: {
    getState: () => getStateMock(),
  },
}))
describe('storePeachInfo', () => {
  const setPaymentMethodsMock = jest.fn()
  const setLatestAppVersionMock = jest.fn()
  const setMinAppVersionMock = jest.fn()
  const setPeachFeeMock = jest.fn()
  const setPeachPGPPublicKeyMock = jest.fn()
  beforeEach(() => {
    getStateMock.mockReturnValue({
      setPaymentMethods: setPaymentMethodsMock,
      setLatestAppVersion: setLatestAppVersionMock,
      setMinAppVersion: setMinAppVersionMock,
      setPeachFee: setPeachFeeMock,
      setPeachPGPPublicKey: setPeachPGPPublicKeyMock,
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('stores peach info', () => {
    storePeachInfo(peachInfo)
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'sepa',
          currencies: ['EUR'],
          anonymous: false,
        }),
      ]),
    )
    expect(setLatestAppVersionMock).toHaveBeenCalledWith(peachInfo.latestAppVersion)
    expect(setMinAppVersionMock).toHaveBeenCalledWith(peachInfo.minAppVersion)
    expect(setPeachFeeMock).toHaveBeenCalledWith(peachInfo.fees.escrow)
    expect(setPeachPGPPublicKeyMock).toHaveBeenCalledWith(peachInfo.peach.pgpPublicKey)
  })
})
