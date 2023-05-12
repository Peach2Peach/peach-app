import { NavigationContainer } from '@react-navigation/native'
import { renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useHeaderState } from '../../../components/header/store'
import { setAccount, updateAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useFundEscrowSetup } from './useFundEscrowSetup'

jest.useFakeTimers()

const apiError = { error: 'UNAUTHORIZED' }
const useRouteMock = jest.fn().mockReturnValue({
  params: { offerId: sellOffer.id },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((..._args) => showHelpMock)
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: (...args: any) => useShowHelpMock(...args),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const useFundingStatusMock = jest.fn().mockReturnValue({
  fundingStatus: defaultFundingStatus,
  userConfirmationRequired: false,
  isLoading: false,
})
jest.mock('../../../hooks/query/useFundingStatus', () => ({
  useFundingStatus: () => useFundingStatusMock(),
}))

const wrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientWrapper>
    <NavigationContainer>{children}</NavigationContainer>
  </QueryClientWrapper>
)

const sellOfferWithEscrow = { ...sellOffer, escrow: 'escrow' }
const createEscrowSuccess = {
  offerId: sellOffer.id,
  escrow: sellOfferWithEscrow.escrow,
  funding: sellOffer.funding,
}

const getOfferDetailsMock = jest.fn().mockReturnValue([sellOfferWithEscrow, null])
const createEscrowMock = jest.fn().mockResolvedValue([createEscrowSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
  createEscrow: (...args: any[]) => createEscrowMock(...args),
}))

jest.mock('./useHandleFundingStatus', () => ({
  useHandleFundingStatus: () => jest.fn(),
}))

const cancelOfferMock = jest.fn()
jest.mock('../../../hooks/useCancelOffer', () => ({
  useCancelOffer:
    () =>
      (...args: any[]) =>
        cancelOfferMock(...args),
}))

describe('useFundEscrowSetup', () => {
  beforeEach(async () => {
    useHeaderState.setState({ title: '', icons: [] })

    await updateAccount(account1, true)
  })
  afterEach(async () => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('should return default values', () => {
    const { result } = renderHook(useFundEscrowSetup, { wrapper })

    expect(result.current).toEqual({
      offerId: sellOffer.id,
      escrow: undefined,
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOffer.amount,
      cancelOffer: expect.any(Function),
    })
  })
  it('should create escrow when it has not been created yet', async () => {
    getOfferDetailsMock.mockReturnValueOnce([{ ...sellOffer, escrow: undefined }, null])
    const { result } = renderHook(useFundEscrowSetup, { wrapper })
    await waitFor(() => expect(createEscrowMock).toHaveBeenCalled())
    expect(result.current.escrow).toBe(sellOfferWithEscrow.escrow)
  })
  it('should handle create escrow errors', async () => {
    getOfferDetailsMock.mockReturnValueOnce([{ ...sellOffer, escrow: undefined }, null])
    createEscrowMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useFundEscrowSetup, { wrapper })
    await waitFor(() => expect(createEscrowMock).toHaveBeenCalled())
    expect(result.current.createEscrowError).toEqual(new Error(apiError.error))
  })
  it('should render header correctly for unfunded offers', () => {
    const { result } = renderHook(useFundEscrowSetup, { wrapper })
    expect(useHeaderState.getState().title).toBe(i18n('sell.escrow.title'))
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
    expect(useHeaderState.getState().icons?.[0].id).toBe('xCircle')
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(result.current.cancelOffer)
    expect(useHeaderState.getState().icons?.[1].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[1].onPress).toEqual(showHelpMock)
  })
  it('should render header correctly for funding in mempool', () => {
    useFundingStatusMock.mockReturnValueOnce({
      fundingStatus: {
        status: 'MEMPOOL',
        txIds: ['txid'],
        vouts: [0],
        amounts: [sellOffer.amount],
        expiry: 4320,
      },
      userConfirmationRequired: false,
      isLoading: false,
    })
    renderHook(useFundEscrowSetup, { wrapper })
    expect(useHeaderState.getState().title).toBe(i18n('sell.funding.mempool.title'))
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(showHelpMock)
  })
  it('should show error banner if there is an error with the funding status', () => {
    useFundingStatusMock.mockReturnValueOnce({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(apiError.error),
    })
    renderHook(useFundEscrowSetup, { wrapper })
    expect(showErrorBannerMock).toHaveBeenCalledWith(apiError.error)
  })
  it('should handle the case that no offer could be returned', async () => {
    await setAccount({ ...account1, offers: [] })

    getOfferDetailsMock.mockReturnValueOnce([null, apiError])
    const { result } = renderHook(useFundEscrowSetup, { wrapper })
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      escrow: undefined,
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    })
  })
  it('should handle the case that no offer could be returned but offer exists locally', () => {
    getOfferDetailsMock.mockReturnValueOnce([null, apiError])
    const { result } = renderHook(useFundEscrowSetup, { wrapper })
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      escrow: 'escrow',
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOffer.amount,
      cancelOffer: expect.any(Function),
    })
  })
})
