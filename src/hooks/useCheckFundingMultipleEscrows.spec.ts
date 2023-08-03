import { renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../tests/unit/data/accountData'
import { sellOffer } from '../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { getTransactionDetails } from '../../tests/unit/helpers/getTransactionDetails'
import { MSINAMINUTE } from '../constants'
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
  const sellOffers = [sellOffer1, sellOffer2, sellOffer3]
  const fundingAmount = sellOffers.map((o) => o.amount).reduce(sum, 0)
  const txDetails = getTransactionDetails(fundingAmount, 1)

  // @ts-ignore
  const peachWallet = new PeachWallet()
  peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
  const getAddressUTXOSpy = jest.spyOn(peachWallet, 'getAddressUTXO')
  const signAndBroadcastPSBTSpy = jest.spyOn(peachWallet, 'signAndBroadcastPSBT')

  beforeAll(() => {
    setPeachWallet(peachWallet)
  })
  beforeEach(() => {
    setAccount({ ...account1, offers: sellOffers })
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
  it('unregisters batch funding once batched tx has been broadcasted', async () => {
    renderHook(useCheckFundingMultipleEscrows, { wrapper })

    jest.advanceTimersByTime(MSINAMINUTE)
    await waitFor(() => expect(signAndBroadcastPSBTSpy).toHaveBeenCalledWith(txDetails.psbt))
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
