import { useState } from "react";
import { Button } from "../../components/buttons/Button";
import { Icon } from "../../components/Icon";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useWalletState } from "../../utils/wallet/walletStore";
import { useFundFromPeachWallet } from "./hooks/useFundFromPeachWallet";

type Props = {
  address: string;
  addresses: string[];
  amount: number;
  fundingStatus: FundingStatus;
};

export const FundFromPeachWalletButton = (props: Props) => {
  const { offerId } = useRoute<"fundEscrow">().params;
  const fundFromPeachWallet = useFundFromPeachWallet();
  const fundedFromPeachWallet = useWalletState((state) =>
    state.isFundedFromPeachWallet(props.address),
  );
  const [isFunding, setIsFunding] = useState(false);

  const onButtonPress = () => {
    setIsFunding(true);
    fundFromPeachWallet({
      offerId,
      amount: props.amount,
      fundingStatus: props.fundingStatus.status,
      address: props.address,
      addresses: props.addresses,
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
};
