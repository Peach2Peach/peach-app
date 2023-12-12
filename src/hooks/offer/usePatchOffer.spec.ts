import { renderHook, responseUtils, waitFor } from 'test-utils'
import { peachAPI } from '../../utils/peachAPI'
import { usePatchOffer } from './usePatchOffer'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const patchOfferMock = jest.spyOn(peachAPI.private.offer, 'patchOffer')

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
    patchOfferMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const newData = { premium: newPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('UNAUTHORIZED')
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
    patchOfferMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const newData = { maxPremium: newMaxPremium }
    const { result } = renderHook(() => usePatchOffer(offerId, newData))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('UNAUTHORIZED')
    })
  })
})
