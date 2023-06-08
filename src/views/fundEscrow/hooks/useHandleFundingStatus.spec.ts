/* eslint-disable max-lines-per-function */
import { renderHook, waitFor } from '@testing-library/react-native'
import { useHandleFundingStatus } from './useHandleFundingStatus'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { account, setAccount } from '../../../utils/account'
import { account1 } from '../../../../tests/unit/data/accountData'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'

const useTradeSummariesMock = jest.fn().mockReturnValue({
  offers: [],
  contracts: [],
  isLoading: false,
  refetch: jest.fn(),
})
jest.mock('../../../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: () => useTradeSummariesMock(),
}))

const showWronglyFundedPopupMock = jest.fn()
jest.mock('../../../popups/useShowWronglyFundedPopup', () => ({
  useShowWronglyFundedPopup: () => showWronglyFundedPopupMock,
}))

const searchWithNoMatches = {
  data: {
    pages: [
      {
        offerId: sellOffer.id,
        matches: [],
        totalMatches: 0,
        nextPage: 1,
      },
    ],
  },
}
const searchWithMatches = {
  data: {
    pages: [
      {
        offerId: sellOffer.id,
        matches: ['1', '2'],
        totalMatches: 2,
        nextPage: 1,
      },
    ],
  },
}
const searchWithNoPages = {
  data: {},
}
const fetchMatchesMock = jest.fn().mockResolvedValue(searchWithNoMatches)
const useOfferMatchesMock = jest.fn().mockReturnValue({
  refetch: fetchMatchesMock,
})
jest.mock('../../search/hooks/useOfferMatches', () => ({
  useOfferMatches: () => useOfferMatchesMock(),
}))

const startRefundPopupMock = jest.fn()
jest.mock('../../../popups/useStartRefundPopup', () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}))

describe('useHandleFundingStatus', () => {
  const fundingStatusFunded: FundingStatus = { ...defaultFundingStatus, status: 'FUNDED' }
  const fundedProps = {
    offerId: sellOffer.id,
    sellOffer,
    fundingStatus: fundingStatusFunded,
    userConfirmationRequired: false,
  }

  beforeEach(() => {
    setAccount({ ...account1, offers: [] })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should do nothing if no sell offer is passed', () => {
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer: undefined,
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
    }
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps })
    expect(replaceMock).not.toHaveBeenCalled()
    expect(startRefundPopupMock).not.toHaveBeenCalled()
    expect(account.offers).toEqual([])
  })
  it('should save offer when funding status updates', () => {
    const fundingStatus = defaultFundingStatus
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    }
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps })
    expect(account.offers[0]).toEqual({ ...sellOffer, funding: fundingStatus })
  })
  it('should handle funding status when it is CANCELED', () => {
    const fundingStatus: FundingStatus = { ...defaultFundingStatus, status: 'CANCELED' }
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    }
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps })
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should show showWronglyFundedPopup when WRONG_FUNDING_AMOUNT', () => {
    const fundingStatus: FundingStatus = { ...defaultFundingStatus, status: 'WRONG_FUNDING_AMOUNT' }
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    }
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps })
    expect(showWronglyFundedPopupMock).toHaveBeenCalledWith({ ...sellOffer, funding: fundingStatus })
  })
  it('should navigate to wrongFundingAmount when user confirmation is required', () => {
    const fundingStatus: FundingStatus = { ...defaultFundingStatus, status: 'MEMPOOL' }
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: true,
    }
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps })
    expect(replaceMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: sellOffer.id })
  })
  it('should go to offerPublished if funding status is FUNDED but no matches yet', async () => {
    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps: fundedProps })
    await waitFor(() => expect(fetchMatchesMock).toHaveBeenCalled())
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId: sellOffer.id, isSellOffer: true })
  })
  it('should go to search if funding status is FUNDED with matches already', async () => {
    fetchMatchesMock.mockResolvedValueOnce(searchWithMatches)

    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps: fundedProps })
    await waitFor(() => expect(fetchMatchesMock).toHaveBeenCalled())
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
  })
  it('should go to offerPublished if funding status is FUNDED but no search response', async () => {
    fetchMatchesMock.mockResolvedValueOnce(searchWithNoPages)

    renderHook(useHandleFundingStatus, { wrapper: NavigationWrapper, initialProps: fundedProps })
    await waitFor(() => expect(fetchMatchesMock).toHaveBeenCalled())
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId: sellOffer.id, isSellOffer: true })
  })
})
