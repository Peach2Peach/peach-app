import { useConfirmPremium } from './useConfirmPremium'
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const patchOfferMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../../utils/peachAPI', () => ({
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

jest.useFakeTimers()

describe('useConfirmPremium', () => {
  const offerId = 'offerId'
  const newPremium = 123

  it('should call patchOffer with the correct params', async () => {
    const { result } = renderHook(() => useConfirmPremium(offerId, newPremium), { wrapper: QueryClientWrapper })
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
    const { result } = renderHook(() => useConfirmPremium(offerId, newPremium), { wrapper: QueryClientWrapper })
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('errorMessage')
    })
  })
})
