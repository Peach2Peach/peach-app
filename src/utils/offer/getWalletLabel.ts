import i18n from '../i18n'
import { peachWallet } from '../wallet/setWallet'

type Params = {
  address?: string
  customPayoutAddress: string | undefined
  customPayoutAddressLabel: string | undefined
  isPeachWalletActive: boolean
}

export const getWalletLabel = ({
  address,
  customPayoutAddress,
  customPayoutAddressLabel,
  isPeachWalletActive,
}: Params) => {
  if (!address) return i18n('offer.summary.customPayoutAddress')

  if (customPayoutAddress === address) {
    return customPayoutAddressLabel || i18n('offer.summary.customPayoutAddress')
  }
  if (!isPeachWalletActive) {
    return i18n('offer.summary.customPayoutAddress')
  }
  if (!!peachWallet.findKeyPairByAddress(address)) {
    return i18n('peachWallet')
  }

  return i18n('offer.summary.customPayoutAddress')
}
