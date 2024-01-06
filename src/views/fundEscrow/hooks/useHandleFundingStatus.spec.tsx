/* eslint-disable max-lines-per-function */
import { render, renderHook, waitFor } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { Popup } from '../../../components/popup/Popup'
import { setAccount, useAccountStore } from '../../../utils/account/account'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useHandleFundingStatus } from './useHandleFundingStatus'

const useTradeSummariesMock = jest.fn().mockReturnValue({
  offers: [],
  contracts: [],
  isLoading: false,
  refetch: jest.fn(),
})
jest.mock('../../../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: () => useTradeSummariesMock(),
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

  it('should do nothing if no sell offer is passed', () => {
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer: undefined,
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
    }
    renderHook(useHandleFundingStatus, { initialProps })
    expect(replaceMock).not.toHaveBeenCalled()
    expect(startRefundPopupMock).not.toHaveBeenCalled()
    const account = useAccountStore.getState().account
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
    renderHook(useHandleFundingStatus, { initialProps })
    const account = useAccountStore.getState().account
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
    renderHook(useHandleFundingStatus, { initialProps })
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
    renderHook(useHandleFundingStatus, { initialProps })
    const { queryByText } = render(<Popup />)
    expect(queryByText('refund escrow')).toBeTruthy()
  })
  it('should navigate to wrongFundingAmount when user confirmation is required', () => {
    const fundingStatus: FundingStatus = { ...defaultFundingStatus, status: 'MEMPOOL' }
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: true,
    }
    renderHook(useHandleFundingStatus, { initialProps })
    expect(replaceMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: sellOffer.id })
  })
  it('should go to search if funding status is FUNDED with matches already', async () => {
    fetchMatchesMock.mockResolvedValueOnce(searchWithMatches)

    renderHook(useHandleFundingStatus, { initialProps: fundedProps })
    await waitFor(() => expect(fetchMatchesMock).toHaveBeenCalled())
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
  })
})
