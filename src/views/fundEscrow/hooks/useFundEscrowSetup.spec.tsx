import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { MSINAMINUTE } from '../../../constants'
import { setAccount, updateAccount } from '../../../utils/account'
import { saveOffer } from '../../../utils/offer'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { peachAPI } from '../../../utils/peachAPI'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useFundEscrowSetup } from './useFundEscrowSetup'

jest.useFakeTimers()

const useRouteMock = jest.fn().mockReturnValue({
  params: { offerId: sellOffer.id },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const showHelpMock = jest.fn()
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: () => showHelpMock,
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const useFundingStatusMock = jest.fn().mockReturnValue({
  fundingStatus: defaultFundingStatus,
  userConfirmationRequired: false,
  isLoading: false,
})
jest.mock('../../../hooks/query/useFundingStatus', () => ({
  useFundingStatus: () => useFundingStatusMock(),
}))

const sellOfferWithEscrow = { ...sellOffer, escrow: 'escrow' }
const createEscrowSuccess = {
  offerId: sellOffer.id,
  escrow: sellOfferWithEscrow.escrow,
  funding: sellOffer.funding,
}

const getOfferDetailsMock = jest.fn().mockReturnValue([sellOfferWithEscrow, null])
const createEscrowMock = jest
  .spyOn(peachAPI.private.offer, 'createEscrow')
  .mockResolvedValue({ result: createEscrowSuccess, ...responseUtils })
jest.mock('../../../utils/peachAPI', () => ({
  peachAPI: jest.requireActual('../../../utils/peachAPI').peachAPI,
  getOfferDetails: () => getOfferDetailsMock(),
}))

jest.mock('./useHandleFundingStatus', () => ({
  useHandleFundingStatus: () => jest.fn(),
}))

const cancelOfferMock = jest.fn()
jest.mock('../../../hooks/useCancelOffer', () => ({
  useCancelOffer: () => cancelOfferMock,
}))

describe('useFundEscrowSetup', () => {
  beforeEach(() => {
    updateAccount({ ...account1, offers: [] }, true)
    useWalletState.getState().reset()
  })
  afterEach(() => {
    queryClient.clear()
  })

  it('should return default values', () => {
    const { result } = renderHook(useFundEscrowSetup)

    expect(result.current).toEqual({
      offerId: sellOffer.id,
      isLoading: true,
      fundingAddress: undefined,
      fundingAddresses: [],
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    })
  })
  it('should return registered funding address for funding multiple offers', () => {
    saveOffer(sellOfferWithEscrow)

    const internalAddress = 'internalAddress'
    useWalletState.getState().registerFundMultiple(internalAddress, [sellOfferWithEscrow.id])
    const { result } = renderHook(useFundEscrowSetup)

    expect(result.current.fundingAddress).toBe(internalAddress)
    expect(result.current.fundingAddresses).toEqual([sellOfferWithEscrow.escrow])
  })
  it('should return default values with locally stored offer', () => {
    saveOffer(sellOfferWithEscrow)
    const { result } = renderHook(useFundEscrowSetup)

    expect(result.current).toEqual({
      offerId: sellOfferWithEscrow.id,
      isLoading: false,
      fundingAddress: sellOfferWithEscrow.escrow,
      fundingAddresses: [sellOfferWithEscrow.escrow],
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOfferWithEscrow.amount,
      cancelOffer: expect.any(Function),
    })
  })
  it('should create escrow when it has not been created yet', async () => {
    getOfferDetailsMock.mockReturnValueOnce([{ ...sellOffer, escrow: undefined }, null])
    const { result } = renderHook(useFundEscrowSetup)
    await waitFor(() => expect(createEscrowMock).toHaveBeenCalled())
    expect(result.current.fundingAddress).toBe(sellOfferWithEscrow.escrow)
  })
  it('should show loading for at least 1 second', async () => {
    getOfferDetailsMock.mockReturnValueOnce([{ ...sellOffer, escrow: undefined }, null])
    const { result } = renderHook(useFundEscrowSetup)
    expect(result.current.isLoading).toBeTruthy()
    await waitFor(() => expect(createEscrowMock).toHaveBeenCalled())
    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should handle create escrow errors', async () => {
    getOfferDetailsMock.mockReturnValueOnce([{ ...sellOffer, escrow: undefined }, null])
    createEscrowMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const { result } = renderHook(useFundEscrowSetup)
    await waitFor(() => expect(createEscrowMock).toHaveBeenCalled())
    expect(result.current.createEscrowError).toEqual(new Error(unauthorizedError.error))
  })
  it('should show error banner if there is an error with the funding status', () => {
    useFundingStatusMock.mockReturnValueOnce({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
    renderHook(useFundEscrowSetup)
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
  it('should handle the case that no offer could be returned', () => {
    setAccount({ ...account1, offers: [] })

    getOfferDetailsMock.mockReturnValueOnce([null, unauthorizedError])
    const { result } = renderHook(useFundEscrowSetup)
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      isLoading: true,
      fundingAddress: undefined,
      fundingAddresses: [undefined],
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    })
  })
  it('should handle the case that no offer could be returned but offer exists locally', () => {
    saveOffer(sellOfferWithEscrow)
    getOfferDetailsMock.mockReturnValueOnce([null, unauthorizedError])
    const { result } = renderHook(useFundEscrowSetup)
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      isLoading: false,
      fundingAddress: 'escrow',
      fundingAddresses: ['escrow'],
      createEscrowError: null,
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOffer.amount,
      cancelOffer: expect.any(Function),
    })
  })
  it('should periodically sync peach wallet if funding multiple escrow', async () => {
    // @ts-ignore
    const peachWallet = new PeachWallet()
    setPeachWallet(peachWallet)
    saveOffer(sellOfferWithEscrow)

    const syncWalletSpy = jest.spyOn(peachWallet, 'syncWallet')
    const internalAddress = 'internalAddress'
    useWalletState.getState().registerFundMultiple(internalAddress, [sellOfferWithEscrow.id])
    renderHook(useFundEscrowSetup)

    await act(async () => {
      await jest.advanceTimersByTime(MSINAMINUTE * 2)
    })

    expect(syncWalletSpy).toHaveBeenCalledTimes(1)

    await act(async () => {
      await jest.advanceTimersByTime(MSINAMINUTE * 2)
    })
    expect(syncWalletSpy).toHaveBeenCalledTimes(2)
  })
  it('should not call sync peach wallet when not funding multiple escrow', () => {
    // @ts-ignore
    const peachWallet = new PeachWallet()
    setPeachWallet(peachWallet)
    saveOffer(sellOfferWithEscrow)

    const syncWalletSpy = jest.spyOn(peachWallet, 'syncWallet')
    renderHook(useFundEscrowSetup)

    jest.advanceTimersByTime(MSINAMINUTE * 2)

    expect(syncWalletSpy).not.toHaveBeenCalled()
  })
})
