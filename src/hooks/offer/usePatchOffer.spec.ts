import { renderHook, waitFor } from 'test-utils'
import { usePatchOffer } from './usePatchOffer'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const patchOfferMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../utils/peachAPI', () => ({
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

jest.useFakeTimers()

describe('usePatchOffer - update Premium', () => {
  const offerId = 'offerId'
  const newPremium = 123

  it('should call patchOffer with the correct params', async () => {
    const newData = { premium: newPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(patchOfferMock).toHaveBeenCalledWith({
        offerId,
        premium: newPremium,
      })
    })
  })

  it('should call showErrorBanner on error', async () => {
    const error = [, { error: 'errorMessage' }]
    patchOfferMock.mockReturnValueOnce(Promise.resolve(error))
    const newData = { premium: newPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('errorMessage')
    })
  })
})

describe('usePatchOffer - update MaxPremium', () => {
  const offerId = 'offerId'
  const newMaxPremium = 123

  it('should call patchOffer with the correct params', async () => {
    const newData = { maxPremium: newMaxPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(patchOfferMock).toHaveBeenCalledWith({
        offerId,
        maxPremium: newMaxPremium,
      })
    })
  })

  it('should call showErrorBanner on error', async () => {
    const error = [, { error: 'errorMessage' }]
    patchOfferMock.mockReturnValueOnce(Promise.resolve(error))
    const newData = { maxPremium: newMaxPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('errorMessage')
    })
  })
})
