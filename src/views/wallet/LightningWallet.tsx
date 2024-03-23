import { NETWORK } from "@env";
import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { ChainSelect } from "./ChainSelect";
import { TotalBalance } from "./components";
import { WalletHeaderLightning } from "./components/WalletHeaderLightning";
import { WALLETS } from "./constants";
import { useLightningWalletBalance } from "./hooks/useLightningWalletBalance";

export const LightningWallet = () => {
  const {
    balance,
    refetch: refetchLightning,
    isRefetching,
    isLoading,
    error,
  } = useLightningWalletBalance();
  const navigation = useStackNavigation();
  const navigateToWallet = (chain: Chain) =>
    navigation.navigate("homeScreen", { screen: WALLETS[chain] });

  if (isLoading) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen header={<WalletHeaderLightning />}>
      <ChainSelect current="lightning" onSelect={navigateToWallet} />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center gap-4 py-16 grow`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchLightning} />
        }
      >
        {NETWORK !== "bitcoin" && (
          <PeachText style={tw`font-bold text-center text-error-dark `}>
            This is not testnet!{"\n"}
            The Peach lightning wallet only works with real sats, use at your
            own risk!
          </PeachText>
        )}
        {!!error && <ErrorBox>{error.message}</ErrorBox>}
        <TotalBalance
          chain="lightning"
          amount={balance.lightning}
          isRefreshing={isRefetching}
        />
        <BackupReminderIcon />
      </PeachScrollView>
      <WalletButtons />
    </Screen>
  );
};

function WalletButtons() {
  const navigation = useStackNavigation();

  const goToSend = () => {
    navigation.navigate("sendBitcoinLightning");
  };
  const goToReceive = () => {
    navigation.navigate("receiveBitcoinLightning");
  };

  return (
    <View style={[tw`items-center justify-center gap-2`, tw`md:gap-4`]}>
      <View
        style={[tw`flex-row items-center justify-center gap-2`, tw`md:gap-4`]}
      >
        <Button style={tw`flex-1 bg-success-main`} onPress={goToReceive}>
          {i18n("wallet.receive")}
        </Button>
        <Button style={tw`flex-1`} onPress={goToSend}>
          {i18n("wallet.send")}
        </Button>
      </View>
    </View>
  );
}
