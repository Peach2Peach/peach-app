import { contract } from '../../../peach-api/src/testData/contract'
import { account1 } from '../../../tests/unit/data/accountData'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { offerSummary } from '../../../tests/unit/data/offerSummaryData'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { setAccount } from '../account/account'
import { labelAddressByTransaction } from './labelAddressByTransaction'
import { useWalletState } from './walletStore'

describe('labelAddressByTransaction', () => {
  beforeAll(() => {
    setAccount(account1)
  })
  afterEach(() => {
    useWalletState.getState().reset()
    useTradeSummaryStore.getState().reset()
  })

  it('does not label address if associated offer cannot be found', () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [offerSummary.id])
    labelAddressByTransaction(confirmed1)
    expect(useWalletState.getState().addressLabelMap).toEqual({})
  })
  it('labels address if associated buy offer can be found', () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [buyOffer.id])
    useTradeSummaryStore.getState().setOffer(buyOffer.id, { ...buyOffer, contractId: contract.id })

    // @ts-ignore
    useTradeSummaryStore.getState().setContract(contract.id, { ...contract, id: `1-${buyOffer.id}` })
    labelAddressByTransaction(confirmed1)
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: 'P‑25',
    })
  })
  it('labels address if associated sell offer can be found', () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [sellOffer.id])
    useTradeSummaryStore.getState().setOffer(sellOffer.id, sellOffer)

    labelAddressByTransaction(confirmed1)
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: 'P‑26',
    })
  })
  it('does not label address if tx default label cannot be determined', () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [sellOffer.id])

    labelAddressByTransaction(confirmed1)
    expect(useWalletState.getState().addressLabelMap).toEqual({})
  })
})
