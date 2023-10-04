/* eslint-disable max-lines-per-function */
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../tests/unit/data/accountData'
import { sellOffer } from '../../tests/unit/data/offerData'
import { offerSummary } from '../../tests/unit/data/offerSummaryData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { getTransactionDetails } from '../../tests/unit/helpers/getTransactionDetails'
import { MSINAMINUTE } from '../constants'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { defaultAccount, setAccount } from '../utils/account'
import { sum } from '../utils/math'
import { PeachWallet } from '../utils/wallet/PeachWallet'
import { setPeachWallet } from '../utils/wallet/setWallet'
import { useWalletState } from '../utils/wallet/walletStore'
import { useCheckFundingMultipleEscrows } from './useCheckFundingMultipleEscrows'

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('useCheckFundingMultipleEscrows', () => {
  const sellOffer1 = sellOffer
  const sellOffer2 = { ...sellOffer, id: '39', escrow: 'escrow2' }
  const sellOffer3 = { ...sellOffer, id: '40', escrow: 'escrow3' }
  const sellOfferSummary1: OfferSummary = { ...offerSummary, id: sellOffer1.id, type: 'ask' }
  const sellOfferSummary2: OfferSummary = { ...sellOfferSummary1, id: sellOffer2.id }
  const sellOfferSummary3: OfferSummary = { ...sellOfferSummary1, id: sellOffer3.id }
  const sellOffers = [sellOffer1, sellOffer2, sellOffer3]
  const sellOfferSummaries = [sellOfferSummary1, sellOfferSummary2, sellOfferSummary3]
  const fundingAmount = sellOffers.map((o) => o.amount).reduce(sum, 0)
  const txDetails = getTransactionDetails(fundingAmount, 1)

  // @ts-expect-error init mock, doesn't need args
  const peachWallet = new PeachWallet()
  peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
  const getAddressUTXOSpy = jest.spyOn(peachWallet, 'getAddressUTXO')
  const signAndBroadcastPSBTSpy = jest.spyOn(peachWallet, 'signAndBroadcastPSBT')

  beforeAll(() => {
    setPeachWallet(peachWallet)
  })
  beforeEach(() => {
    setAccount({ ...account1, offers: sellOffers })
    useTradeSummaryStore.getState().reset()
    useTradeSummaryStore.getState().setOffers(sellOfferSummaries)
    useWalletState.getState().registerFundMultiple(
      'address',
      sellOffers.map((o) => o.id),
    )
  })
  it('check each registered address for funding each minute', () => {
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    expect(getAddressUTXOSpy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(MSINAMINUTE)
    expect(getAddressUTXOSpy).toHaveBeenCalledWith('address')
    jest.advanceTimersByTime(MSINAMINUTE)
    expect(getAddressUTXOSpy).toHaveBeenCalledTimes(2)
  })
  it('craft batched funding transaction once funds have been detected in address', async () => {
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    jest.advanceTimersByTime(MSINAMINUTE)
    await waitFor(() => expect(signAndBroadcastPSBTSpy).toHaveBeenCalledWith(txDetails.psbt))
  })
  it('unregisters batch funding once batched tx has been broadcasted and registered by peach server', async () => {
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    jest.advanceTimersByTime(MSINAMINUTE)
    await waitFor(() => expect(signAndBroadcastPSBTSpy).toHaveBeenCalledWith(txDetails.psbt))
    expect(useWalletState.getState().fundMultipleMap).toEqual({
      address: ['38', '39', '40'],
    })
    act(() => {
      useTradeSummaryStore.getState().reset()
      useTradeSummaryStore.getState().setOffers(sellOfferSummaries.map((offer) => ({ ...offer, fundingTxId: '1' })))
    })
    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
  })
  it('aborts if no escrow addresses can be found', () => {
    setAccount(defaultAccount)
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    jest.advanceTimersByTime(MSINAMINUTE)
    expect(getAddressUTXOSpy).not.toHaveBeenCalled()
  })
  it('aborts if no local utxo can be found', () => {
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    getAddressUTXOSpy.mockResolvedValueOnce([])
    jest.advanceTimersByTime(MSINAMINUTE)
    expect(signAndBroadcastPSBTSpy).not.toHaveBeenCalled()
  })
})
