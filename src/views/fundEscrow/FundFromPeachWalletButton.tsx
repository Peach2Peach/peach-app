import { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/buttons/Button";
import { TradeInfo } from "../../components/offer/TradeInfo";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useWalletState } from "../../utils/wallet/walletStore";
import { useFundFromPeachWallet } from "./hooks/useFundFromPeachWallet";

type Props = {
  address: string;
  addresses: string[];
  amount: number;
  fundingStatus: FundingStatus;
  offerId: string;
};
export function FundFromPeachWalletButton({
  amount,
  fundingStatus,
  address,
  addresses,
  offerId,
}: Props) {
  const fundFromPeachWallet = useFundFromPeachWallet();
  const fundedFromPeachWallet = useWalletState((state) =>
    state.isFundedFromPeachWallet(address),
  );
  const [isFunding, setIsFunding] = useState(false);

  const onButtonPress = async () => {
    setIsFunding(true);
    await fundFromPeachWallet({
      offerId,
      amount,
      fundingStatus: fundingStatus?.status,
      address,
      addresses,
    }).then(() => setIsFunding(false));
  };

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={i18n("fundFromPeachWallet.funded")}
          IconComponent={
            <Icon id="checkCircle" size={16} color={tw.color("success-main")} />
          }
        />
      ) : (
        <Button
          ghost
          textColor={tw.color("primary-main")}
          iconId="sell"
          onPress={onButtonPress}
          loading={isFunding}
        >
          {i18n("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
