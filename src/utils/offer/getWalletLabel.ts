import i18n from "../i18n";
import { peachWallet } from "../wallet/setWallet";

type Params = {
  address?: string;
  customAddress: string | undefined;
  customAddressLabel: string | undefined;
  isPeachWalletActive: boolean;
};

export const getWalletLabel = ({
  address,
  customAddress,
  customAddressLabel,
  isPeachWalletActive,
}: Params) => {
  if (!address) return i18n("offer.summary.customPayoutAddress");

  if (customAddress === address) {
    return customAddressLabel || i18n("offer.summary.customPayoutAddress");
  }
  if (!isPeachWalletActive) {
    return i18n("offer.summary.customPayoutAddress");
  }
  if (peachWallet?.findKeyPairByAddress(address)) {
    return i18n("peachWallet");
  }

  return i18n("offer.summary.customPayoutAddress");
};
