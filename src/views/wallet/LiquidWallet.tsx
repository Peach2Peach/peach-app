import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { ChainSelect } from "./ChainSelect";
import { TotalBalance } from "./components";
import { Swaps } from "./components/Swaps";
import { WalletHeaderLiquid } from "./components/WalletHeaderLiquid";
import { SwapButton } from "./components/submarineSwaps/SwapButton";
import { useSyncLiquidWallet } from "./hooks/useSyncLiquidWallet";

export const LiquidWallet = () => {
  const balance = useLiquidWalletState((state) => state.balance);
  const { refetch: refetchLiquid, isRefetching: isRefetchingLiquid } =
    useSyncLiquidWallet({ enabled: true });
  return (
    <Screen style={tw`gap-4`} header={<WalletHeaderLiquid />}>
      <ChainSelect current="liquid" />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow gap-4`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchLiquid} />
        }
      >
        <TotalBalance
          chain="liquid"
          amount={balance}
          isRefreshing={isRefetchingLiquid}
        />
        <BackupReminderIcon />
      </PeachScrollView>
      <Swaps />
      <WalletButtons />
    </Screen>
  );
};

function WalletButtons() {
  const navigation = useStackNavigation();

  const goToSend = () => {
    navigation.navigate("sendBitcoinLiquid");
  };

  return (
    <View style={[tw`items-center justify-center gap-2`, tw`md:gap-4`]}>
      <View
        style={[tw`flex-row items-center justify-center gap-2`, tw`md:gap-4`]}
      >
        <Button style={tw`w-1/2 flex-1`} onPress={goToSend}>
          {i18n("wallet.send")}
        </Button>
        <View style={tw`w-1/2 `}>
          <SwapButton />
        </View>
      </View>
    </View>
  );
}
