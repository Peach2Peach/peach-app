import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { Placeholder } from "../../components/Placeholder";
import { Screen } from "../../components/Screen";
import { BitcoinAddressInput } from "../../components/inputs/BitcoinAddressInput";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { InfoFrame } from "../../components/ui/InfoFrame";
import { useValidatedState } from "../../hooks/useValidatedState";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { rules } from "../../utils/validation/rules";

const addressRules = {
  bitcoinAddress: true,
};

export const AddressChecker = () => {
  const [address, setAddress, , errorMessage] = useValidatedState<string>(
    "",
    addressRules,
  );

  return (
    <Screen header={i18n("wallet.addressChecker")}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <InfoFrame text={i18n("wallet.addressChecker.hint")} />
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

  return (
    <View>
      {isMine === undefined ? (
        rules.bitcoinAddress(address) ? (
          <Loading />
        ) : (
          <Placeholder style={tw`h-24px`} />
        )
      ) : (
        <TradeInfo
          text={i18n(
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
