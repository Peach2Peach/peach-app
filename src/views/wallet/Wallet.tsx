import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { ChainSelect } from "./ChainSelect";
import { TotalBalance, WalletHeader } from "./components";
import { useLastUnusedAddress, useUTXOs, useWalletAddress } from "./hooks";
import { useSyncWallet } from "./hooks/useSyncWallet";
import { useWalletBalance } from "./hooks/useWalletBalance";

export const Wallet = () => {
  const { balance } = useWalletBalance();
  const {
    refetch,
    isRefetching: isRefetchingBitcoin,
    isLoading: isLoadingBitcoin,
  } = useSyncWallet({ enabled: true });

  return (
    <Screen header={<WalletHeader />}>
      <ChainSelect current="bitcoin" />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        <TotalBalance
          chain="bitcoin"
          amount={balance}
          isRefreshing={isRefetchingBitcoin || isLoadingBitcoin}
        />
        <BackupReminderIcon />
      </PeachScrollView>
      <WalletButtons />
    </Screen>
  );
};

const useAddressPrefetch = () => {
  const { data } = useLastUnusedAddress();
  const displayIndex = data?.index ?? 0;
  useWalletAddress(displayIndex);
  useWalletAddress(displayIndex + 1);
  useWalletAddress(displayIndex - 1);
};
function WalletButtons() {
  const navigation = useStackNavigation();
  useAddressPrefetch();
  useUTXOs();

  const goToSend = () => {
    navigation.navigate("sendBitcoin");
  };
  const goToReceive = () => {
    navigation.navigate("receiveBitcoin");
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
