import { useState } from "react";
import { RefreshControl, View } from "react-native";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { WarningFrame } from "../../components/ui/WarningFrame";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useWalletSyncStore } from "../../utils/wallet/walletSyncStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TotalBalance, WalletHeader } from "./components";
import { useLastUnusedAddress, useUTXOs, useWalletAddress } from "./hooks";
import { useSyncWallet } from "./hooks/useSyncWallet";
import { useWalletBalance } from "./hooks/useWalletBalance";

export const Wallet = () => {
  const { balance } = useWalletBalance();
  const [fundAddressMessage, setFundAddressMessage] = useState("");
  const { refetch, isRefetching, isLoading } = useSyncWallet({ enabled: true });
  const { isDarkMode } = useThemeStore();
  const externalScanProgress = useWalletSyncStore(
    (state) => state.externalScanProgress,
  );
  const internalScanProgress = useWalletSyncStore(
    (state) => state.internalScanProgress,
  );
  const scanProgressLines = [
    externalScanProgress !== null
      ? i18n("wallet.scanProgress.receiving", String(externalScanProgress))
      : null,
    // change addresses are only scanned once the receiving addresses are done
    internalScanProgress !== null
      ? i18n("wallet.scanProgress.change", String(internalScanProgress))
      : null,
  ].filter((line): line is string => line !== null);

  if (isLoading)
    return (
      <BitcoinLoading
        text={i18n("wallet.loading")}
        subtext={scanProgressLines.join("\n") || undefined}
      />
    );

  const hintColor = isDarkMode ? tw.color("black-65") : tw.color("black-25");

  return (
    <Screen header={<WalletHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`items-center justify-center py-16 grow`}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
      >
        <PeachText style={[tw`text-sm text-center mb-6`, { color: hintColor }]}>
          {isRefetching
            ? i18n("walletIsRefreshing")
            : i18n("slideDownToRefresh")}
        </PeachText>
        {scanProgressLines.map((line) => (
          <PeachText
            key={line}
            style={[tw`text-xs text-center mb-1`, { color: hintColor }]}
          >
            {line}
          </PeachText>
        ))}
        <WarningFrame text={i18n("wallet.seedPhraseWarning")} />
        <TotalBalance amount={balance} isRefreshing={isRefetching} />
        <PeachText
          style={[tw`mt-3 text-xs text-center px-6`, { color: hintColor }]}
        >
          {i18n("wallet.missingBalance")}
        </PeachText>
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
