import { getSellOfferFromContract } from '.'
import { getWalletLabel } from '../offer'

export const getWalletLabelFromContract = (
  contract: Contract,
  customPayoutAddress?: string | undefined,
  customPayoutAddressLabel?: string | undefined,
) => {
  const sellOffer = getSellOfferFromContract(contract)
  const walletLabel
    = sellOffer.walletLabel
    || getWalletLabel({ address: sellOffer.returnAddress, customPayoutAddress, customPayoutAddressLabel })
  return walletLabel
}
