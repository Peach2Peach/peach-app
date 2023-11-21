import { getWalletLabel } from '../offer'
import { getSellOfferFromContract } from './getSellOfferFromContract'

type Params = {
  contract: Contract
  customPayoutAddress?: string | undefined
  customPayoutAddressLabel?: string | undefined
  isPeachWalletActive: boolean
}

export const getWalletLabelFromContract = ({
  contract,
  customPayoutAddress,
  customPayoutAddressLabel,
  isPeachWalletActive,
}: Params) => {
  const sellOffer = getSellOfferFromContract(contract)
  const walletLabel
    = sellOffer.walletLabel
    || getWalletLabel({
      address: sellOffer.returnAddress,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive,
    })
  return walletLabel
}
