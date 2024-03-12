import { BREEZ_API_KEY, NETWORK } from "@env";
import { useState } from "react";
import { RefreshControl, View } from "react-native";
import { shallow } from "zustand/shallow";
import { BackupReminderIcon } from "../../components/BackupReminderIcon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { PeachText } from "../../components/text/PeachText";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import i18n from "../../utils/i18n";
import { initLightningWallet } from "../../utils/lightning/initLightningWallet";
import { parseError } from "../../utils/parseError";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TotalBalance } from "./components";
import { WalletHeaderLightning } from "./components/WalletHeaderLightning";
import { SwapButton } from "./components/submarineSwaps/SwapButton";
import { useLightningWalletBalance } from "./hooks/useLightningWalletBalance";

/** @description only needed while testing, production won't require invite code */
const TesterInvite = () => {
  const mnemonic = useAccountStore((state) => state.account.mnemonic);
  const [breezInviteCode, setBreezInviteCode] = useSettingsStore(
    (state) => [state.breezInviteCode, state.setBreezInviteCode],
    shallow,
  );
  const [initError, setInitError] = useState("");
  const enableLightning = async () => {
    if (!mnemonic || !breezInviteCode) return;
    try {
      await initLightningWallet(mnemonic, BREEZ_API_KEY, breezInviteCode);
    } catch (e) {
      setInitError(parseError(e));
    }
  };
  return (
    <>
      {!!initError && <ErrorBox>{initError}</ErrorBox>}
      <Input
        label="introduce invite code"
        value={breezInviteCode}
        onChangeText={setBreezInviteCode}
      />
      <Button onPress={enableLightning} disabled={!breezInviteCode}>
        Get⚡️lightning
      </Button>
    </>
  );
};

export const LightningWallet = () => {
  const { balance, refetch, isRefetching, isLoading, error } =
    useLightningWalletBalance();

  if (isLoading) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen header={<WalletHeaderLightning />}>
      <SelectLayer />
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow gap-4`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        {NETWORK !== "bitcoin" && (
          <PeachText style={tw`text-error-dark font-bold text-center `}>
            This is not testnet!{"\n"}
            The Peach lightning wallet only works with real sats, use at your
            own risk!
          </PeachText>
        )}
        {!!error && (
          <>
            <ErrorBox>{error.message}</ErrorBox>
            <TesterInvite />
          </>
        )}
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
  const goToLiquidWallet = () => {
    navigation.navigate("liquidWallet");
  };
  return (
    <View style={tw`flex-row gap-4 justify-center p-4`}>
      <PeachText onPress={goToBitcoinWallet}>on-chain</PeachText>
      <PeachText onPress={goToLiquidWallet}>liquid</PeachText>
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
