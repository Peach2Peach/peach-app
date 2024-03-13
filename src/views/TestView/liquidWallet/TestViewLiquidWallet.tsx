import { useState } from "react";
import { Alert, View } from "react-native";
import Share from "react-native-share";
import { Divider } from "../../../components/Divider";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { Button } from "../../../components/buttons/Button";
import { BitcoinAddressInput } from "../../../components/inputs/BitcoinAddressInput";
import { Input } from "../../../components/inputs/Input";
import { LiquidAddressInput } from "../../../components/inputs/LiquidAddressInput";
import { NumberInput } from "../../../components/inputs/NumberInput";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { useValidatedState } from "../../../hooks/useValidatedState";
import tw from "../../../styles/tailwind";
import { useAccountStore } from "../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../utils/account/getMessageToSignForAddress";
import i18n from "../../../utils/i18n";
import { showLiquidTransaction } from "../../../utils/liquid/showLiquidTransaction";
import { log } from "../../../utils/log/log";
import { peachAPI } from "../../../utils/peachAPI";
import { thousands } from "../../../utils/string/thousands";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { buildTransaction } from "../../../utils/wallet/liquid/buildTransaction";
import { peachLiquidWallet } from "../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../utils/wallet/useLiquidWalletState";

const liquidAddressRules = { required: false, liquidAddress: true };

export const TestViewLiquidWallet = () => {
  const [address, setAddress, , addressErrors] = useValidatedState<string>(
    "",
    liquidAddressRules,
  );
  const balance = useLiquidWalletState((state) => state.balance);

  const [amount, setAmount] = useState("0");
  const [txId] = useState("");
  const getNewAddress = () => {
    if (!peachLiquidWallet) return;
    const { address: newAddress } = peachLiquidWallet.getAddress();
    if (newAddress) setAddress(newAddress);
  };
  const isRefetching = false;
  const getNewInternalAddress = () => {
    if (!peachLiquidWallet) return;
    const { address: newAddress } = peachLiquidWallet.getInternalAddress();
    if (newAddress) setAddress(newAddress);
  };
  const send = async () => {
    if (!address || !amount || !peachLiquidWallet) return;
    const transaction = buildTransaction({
      recipients: [{ address, amount: Number(amount) }],
      miningFees: 500,
      inputs: peachLiquidWallet?.utxos,
    });
    await peachAPI.public.liquid.postTx({
      tx: transaction.toHex(),
    });
    peachLiquidWallet.syncWallet();
  };
  const refill = () => {
    Alert.alert("TODO");
  };
  const refetch = () => {
    peachLiquidWallet?.syncWallet();
  };
  return (
    <Screen>
      <PeachScrollView>
        <View style={tw`gap-4`}>
          <PeachText style={tw`text-center button-medium`}>
            {i18n("wallet.totalBalance")}:
          </PeachText>
          <BTCAmount
            style={[tw`self-center`, isRefetching && tw`opacity-60`]}
            amount={balance}
            size="large"
          />

          <View>
            <PeachText style={tw`button-medium`}>
              {i18n("wallet.withdrawTo")}:
            </PeachText>
            <LiquidAddressInput
              style={tw`mt-4`}
              onChangeText={setAddress}
              value={address}
              errorMessage={addressErrors}
            />
            <NumberInput onChangeText={setAmount} value={amount} />
          </View>
          <Button onPress={send} iconId="upload">
            send {thousands(Number(amount))} sats
          </Button>
          {!!txId && (
            <View>
              <PeachText
                onPress={() => showLiquidTransaction(txId, getLiquidNetwork())}
              >
                txId: {txId}
              </PeachText>
            </View>
          )}

          <Divider />
          <Button onPress={getNewAddress} iconId="refreshCcw">
            get new address
          </Button>
          <Button onPress={getNewInternalAddress} iconId="refreshCcw">
            get new internal address
          </Button>
          <Button onPress={refill} iconId="star">
            1M sats refill
          </Button>

          <Divider />
          <Button onPress={() => refetch()} iconId="refreshCcw">
            sync wallet
          </Button>

          <SignMessage />
        </View>
      </PeachScrollView>
    </Screen>
  );
};

function SignMessage() {
  const defaultUserId = useAccountStore((state) => state.account.publicKey);
  const [userId, setUserId] = useState(defaultUserId);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const onPress = () => {
    if (!peachLiquidWallet) return;
    const message = getMessageToSignForAddress(userId, address);
    const sig = peachLiquidWallet.signMessage(message, address);
    setSignature(sig);
  };

  const shareSignature = () => {
    Share.open({ message: signature }).catch((e) => log(e));
  };

  return (
    <View>
      <BitcoinAddressInput
        label="address"
        onChangeText={setAddress}
        value={address}
      />
      <Input
        label="userID"
        required={false}
        onChangeText={setUserId}
        value={userId}
      />
      <Button onPress={onPress}>sign</Button>
      <PeachText>signature</PeachText>
      <View style={tw`flex-row items-center flex-1 gap-4 px-4`}>
        <PeachText style={tw`shrink`} selectable onLongPress={shareSignature}>
          {signature}
        </PeachText>
        {!!signature && <CopyAble value={signature} />}
      </View>
    </View>
  );
}
