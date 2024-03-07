import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TotalBalance } from "./components";
import { WalletHeaderLightning } from "./components/WalletHeaderLightning";
import { SwapButton } from "./components/submarineSwaps/SwapButton";
import { useLightningWalletBalance } from "./hooks/useLightningWalletBalance";

export const LightningWallet = () => {
  const { balance, refetch, isRefetching, isLoading } =
    useLightningWalletBalance();

  if (isLoading) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen header={<WalletHeaderLightning />}>
      <SelectLayer />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        <TotalBalance amount={balance.lightning} isRefreshing={isRefetching} />
        <BackupReminderIcon />
      </PeachScrollView>
      <WalletButtons />
    </Screen>
  );
};

function SelectLayer() {
  const navigation = useStackNavigation();
  const goToBitcoinWallet = () => {
    navigation.navigate("homeScreen", { screen: "wallet" });
  };
  return (
    <View style={tw`flex-row gap-4 justify-center p-4`}>
      <PeachText onPress={goToBitcoinWallet}>on-chain</PeachText>
      <PeachText style={tw`font-bold`}>lightning</PeachText>
    </View>
  );
}

function WalletButtons() {
  const navigation = useStackNavigation();
  const liquidBalance = useLiquidWalletState((state) => state.balance);

  const goToSend = () => {
    navigation.navigate("sendBitcoinLightning");
  };
  const goToReceive = () => {
    navigation.navigate("receiveBitcoinLightning");
  };

  return (
    <View style={[tw`items-center justify-center gap-2`, tw`md:gap-4`]}>
      {liquidBalance > 0 && <SwapButton />}
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
