import { NETWORK } from "@env";
import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { WarningFrame } from "../../components/ui/WarningFrame";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { fundAddress } from "../../utils/regtest/fundAddress";
import { peachWallet } from "../../utils/wallet/setWallet";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TotalBalance, WalletHeader } from "./components";
import { useLastUnusedAddress, useUTXOs, useWalletAddress } from "./hooks";
import { useSyncWallet } from "./hooks/useSyncWallet";
import { useWalletBalance } from "./hooks/useWalletBalance";

export const Wallet = () => {
  const { balance } = useWalletBalance();
  const { refetch, isRefetching, isLoading } = useSyncWallet({ enabled: true });
  if (isLoading) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen header={<WalletHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`items-center justify-center py-16 grow`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
      >
        {NETWORK === "regtest" && (
          <Button
            style={tw`self-center`}
            onPress={async () => {
              if (!peachWallet) return;
              await fundAddress({
                address: (await peachWallet.getAddress()).address,
                amount: 1000000,
              });
            }}
          >
            Fund Wallet
          </Button>
        )}
        <WarningFrame text={i18n("wallet.seedPhraseWarning")} />
        <TotalBalance amount={balance} isRefreshing={isRefetching} />
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
    navigation.navigateDeprecated("sendBitcoin");
  };
  const goToReceive = () => {
    navigation.navigateDeprecated("receiveBitcoin");
  };
  return (
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
  );
}
