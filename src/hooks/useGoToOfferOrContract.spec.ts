import { renderHook, responseUtils } from 'test-utils'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { peachAPI } from '../utils/peachAPI'
import { useGoToOfferOrContract } from './useGoToOfferOrContract'

const getOfferDetailsMock = jest.spyOn(peachAPI.private.offer, 'getOfferDetails')

describe('useGoToOfferOrContract', () => {
  it('should navigate to the contract if the id is a contract id', async () => {
    const { result } = renderHook(useGoToOfferOrContract)

    await result.current('123-456')

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: '123-456' })
  })

  it('should navigate to the offer if the id is an offer id', async () => {
    const { result } = renderHook(useGoToOfferOrContract)

    await result.current('123')

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('search', { offerId: '38' })
  })
  it('should not navigate if the id is an offer id and the offer is not found', async () => {
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils)
    const { result } = renderHook(useGoToOfferOrContract)

    await result.current('123')

    expect(navigateMock).toHaveBeenCalledTimes(0)
  })
})
