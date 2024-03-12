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
import { TotalBalance } from "./components";
import { WalletHeaderLiquid } from "./components/WalletHeaderLiquid";
import { useSyncLiquidWallet } from "./hooks/useSyncLiquidWallet";

export const LiquidWallet = () => {
  const balance = useLiquidWalletState((state) => state.balance);
  const { refetch: refetchLiquid, isRefetching: isRefetchingLiquid } =
    useSyncLiquidWallet({ enabled: true });
  return (
    <Screen header={<WalletHeaderLiquid />}>
      <SelectLayer />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow gap-4`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchLiquid} />
        }
      >
        <TotalBalance amount={balance} isRefreshing={isRefetchingLiquid} />
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
  const goToLightningWallet = () => {
    navigation.navigate("lightningWallet");
  };
  return (
    <View style={tw`flex-row gap-4 justify-center p-4`}>
      <PeachText onPress={goToBitcoinWallet}>on-chain</PeachText>
      <PeachText style={tw`font-bold`}>liquid</PeachText>
      <PeachText onPress={goToLightningWallet}>lightning</PeachText>
    </View>
  );
}

function WalletButtons() {
  const navigation = useStackNavigation();

  const goToSend = () => {
    navigation.navigate("sendBitcoinLiquid");
  };
  const goToReceive = () => {
    navigation.navigate("receiveBitcoinLiquid");
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
