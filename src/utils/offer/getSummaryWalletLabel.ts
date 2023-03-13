import i18n from '../i18n'
import { peachWallet } from '../wallet/setWallet'

type Params = {
  offerWalletLabel: string | undefined
  address: string
  customPayoutAddress: string | undefined
  customPayoutAddressLabel: string | undefined
}

export const getSummaryWalletLabel = ({
  offerWalletLabel,
  address,
  customPayoutAddress,
  customPayoutAddressLabel,
}: Params) => {
  if (!address) return undefined

  if (offerWalletLabel) {
    return offerWalletLabel
  }
  if (customPayoutAddress === address) {
    return customPayoutAddressLabel
  }
  if (!!peachWallet.findKeyPairByAddress(address)) {
    return i18n('peachWallet')
  }

  return undefined
}
