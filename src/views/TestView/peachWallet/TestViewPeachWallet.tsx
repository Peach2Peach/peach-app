import { NETWORK } from "@env";
import { useState } from "react";
import { View } from "react-native";
import { Divider } from "../../../components/Divider";
import { Loading } from "../../../components/Loading";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { Button } from "../../../components/buttons/Button";
import { BitcoinAddressInput } from "../../../components/inputs/BitcoinAddressInput";
import { NumberInput } from "../../../components/inputs/NumberInput";
import { PeachText } from "../../../components/text/PeachText";
import { useValidatedState } from "../../../hooks/useValidatedState";
import tw from "../../../styles/tailwind";
import { showTransaction } from "../../../utils/bitcoin/showTransaction";
import i18n from "../../../utils/i18n";
import { fundAddress } from "../../../utils/regtest/fundAddress";
import { thousands } from "../../../utils/string/thousands";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useSyncWallet } from "../../wallet/hooks/useSyncWallet";
import { useWalletBalance } from "../../wallet/hooks/useWalletBalance";

const bitcoinAddressRules = { required: false, bitcoinAddress: true };

export const TestViewPeachWallet = () => {
  const { refetch, isRefetching, isLoading } = useSyncWallet();
  const { balance } = useWalletBalance();
  const [address, setAddress, , addressErrors] = useValidatedState<string>(
    "",
    bitcoinAddressRules,
  );

  const [amount, setAmount] = useState("0");
  const [txId, setTxId] = useState("");
  const getNewAddress = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    const newAddress = await peachWallet.getAddress();
    setAddress(newAddress.address);
  };
  const getNewInternalAddress = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    const newAddress = await peachWallet.getInternalAddress();
    setAddress(newAddress.address);
  };
  const send = async () => {
    if (!address) throw Error("Address invalid");
    if (!peachWallet) throw Error("Peach wallet not defined");
    const { psbt } = await peachWallet.buildFinishedTransaction({
      address,
      amount: 50000,
      feeRate: 3,
    });
    const result = await peachWallet.signAndBroadcastPSBT(psbt);
    setTxId(await result.txid());
  };
  const refill = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    const { address: newAddress } = await peachWallet.getAddress();
    fundAddress({ address: newAddress, amount: 1000000 });
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
          {(isRefetching || isLoading) && <Loading style={tw`absolute`} />}

          <View>
            <PeachText style={tw`button-medium`}>
              {i18n("wallet.withdrawTo")}:
            </PeachText>
            <BitcoinAddressInput
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
              <PeachText onPress={() => showTransaction(txId, NETWORK)}>
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
        </View>
      </PeachScrollView>
    </Screen>
  );
};
