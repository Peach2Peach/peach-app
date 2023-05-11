import { getSellOfferFromContract, verifyAndSignReleaseTx } from '.'
import { getEscrowWalletForOffer } from '../wallet'

export const signReleaseTxOfContract = (contract: Contract) => {
  const sellOffer = getSellOfferFromContract(contract)
  return verifyAndSignReleaseTx(contract, sellOffer, getEscrowWalletForOffer(sellOffer))
}
