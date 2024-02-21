import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { Placeholder } from "../../components/Placeholder";
import { Screen } from "../../components/Screen";
import { Loading } from "../../components/animation/Loading";
import { BitcoinAddressInput } from "../../components/inputs/BitcoinAddressInput";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { InfoFrame } from "../../components/ui/InfoFrame";
import { useValidatedState } from "../../hooks/useValidatedState";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import tw from "../../styles/tailwind";
import { rules } from "../../utils/validation/rules";
import { useTranslate } from "@tolgee/react";

const addressRules = {
  bitcoinAddress: true,
};

export const AddressChecker = () => {
  const { t } = useTranslate("wallet");
  const [address, setAddress, , errorMessage] = useValidatedState<string>(
    "",
    addressRules,
  );

  return (
    <Screen header={t("wallet.addressChecker")}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <InfoFrame text={t("wallet.addressChecker.hint")} />
        <BitcoinAddressInput
          value={address}
          onChangeText={setAddress}
          errorMessage={errorMessage}
        />
        <AddressInfo address={address} />
      </View>
    </Screen>
  );
};

function AddressInfo({ address }: { address: string }) {
  const isMine = useIsMyAddress(address);
  const { t } = useTranslate("wallet");

  return (
    <View>
      {isMine === undefined ? (
        rules.bitcoinAddress(address) ? (
          <Loading style={tw`w-6 h-6`} />
        ) : (
          <Placeholder style={tw`h-24px`} />
        )
      ) : (
        <TradeInfo
          text={t(
            isMine
              ? "wallet.addressChecker.belongsToWallet"
              : "wallet.addressChecker.doesNotbelongToWallet",
          )}
          IconComponent={
            <Icon
              size={20}
              id={isMine ? "checkSquare" : "xSquare"}
              color={tw.color(isMine ? "success-main" : "error-main")}
            />
          }
        />
      )}
    </View>
  );
}
