import { getEscrowWalletForOffer } from '../wallet/getEscrowWalletForOffer'
import { getSellOfferFromContract } from './getSellOfferFromContract'
import { verifyAndSignReleaseTx } from './verifyAndSignReleaseTx'

export const signReleaseTxOfContract = (contract: Contract) => {
  const sellOffer = getSellOfferFromContract(contract)
  return verifyAndSignReleaseTx(contract, sellOffer, getEscrowWalletForOffer(sellOffer))
}
