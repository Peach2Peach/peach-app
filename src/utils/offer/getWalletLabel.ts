import { peachWallet } from "../wallet/setWallet";
import { tolgee } from "../../tolgee";

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
  if (!address)
    return tolgee.t("offer.summary.customPayoutAddress", { ns: "offer" });

  if (customAddress === address) {
    return (
      customAddressLabel ||
      tolgee.t("offer.summary.customPayoutAddress", { ns: "offer" })
    );
  }
  if (!isPeachWalletActive) {
    return tolgee.t("offer.summary.customPayoutAddress", { ns: "offer" });
  }
  if (peachWallet?.findKeyPairByAddress(address)) {
    return tolgee.t("peachWallet", { ns: "wallet" });
  }

  return tolgee.t("offer.summary.customPayoutAddress", { ns: "offer" });
};
