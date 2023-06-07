import { act, renderHook } from '@testing-library/react-native'
import { useAutoFundOffer } from './useAutoFundOffer'
import { sellOffer } from '../../../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../../../utils/offer/constants'

const apiSuccess = { success: true }
const fundEscrowMock = jest.fn().mockResolvedValue([apiSuccess])
const generateBlockMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../../../utils/peachAPI', () => ({
  fundEscrow: (...args: any[]) => fundEscrowMock(...args),
  generateBlock: (...args: any[]) => generateBlockMock(...args),
}))

describe('useAutoFundOffer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return default values', () => {
    const { result } = renderHook(useAutoFundOffer, {
      initialProps: { offerId: sellOffer.id, fundingStatus: defaultFundingStatus },
    })

    expect(result.current).toEqual({
      showRegtestButton: true,
      fundEscrowAddress: expect.any(Function),
    })
  })
  it('should send API request to regtest server to fund offer', async () => {
    fundEscrowMock.mockResolvedValueOnce([null])

    const { result } = renderHook(useAutoFundOffer, {
      initialProps: { offerId: sellOffer.id, fundingStatus: defaultFundingStatus },
    })
    await act(result.current.fundEscrowAddress)

    expect(generateBlockMock).not.toHaveBeenCalled()
  })
  it('does not request to mine a block if offer could not be funded', async () => {
    const { result } = renderHook(useAutoFundOffer, {
      initialProps: { offerId: sellOffer.id, fundingStatus: defaultFundingStatus },
    })
    await act(result.current.fundEscrowAddress)

    expect(fundEscrowMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
    expect(generateBlockMock).toHaveBeenCalled()
    expect(result.current.showRegtestButton).toBeFalsy()
  })
  it('does nothing if offer is already funded', async () => {
    const { result } = renderHook(useAutoFundOffer, {
      initialProps: { offerId: sellOffer.id, fundingStatus: { ...defaultFundingStatus, status: 'MEMPOOL' } },
    })
    await act(result.current.fundEscrowAddress)

    expect(fundEscrowMock).not.toHaveBeenCalled()
    expect(generateBlockMock).not.toHaveBeenCalled()
  })
})
