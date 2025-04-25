import { Transaction } from "bitcoinjs-lib";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Divider } from "../../components/Divider";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useRoute } from "../../hooks/useRoute";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { getErrorsInField } from "../../utils/validation/getErrorsInField";
import { getMessages } from "../../utils/validation/getMessages";
import { useWalletState } from "../../utils/wallet/walletStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { CurrentFee } from "./components/bumpNetworkFees/CurrentFee";
import { FeeInfo } from "./components/bumpNetworkFees/FeeInfo";
import { NewFee } from "./components/bumpNetworkFees/NewFee";
import { useBumpFees } from "./hooks/useBumpFees";
import { useMappedTransactionDetails } from "./hooks/useMappedTransactionDetails";
import { useTxFeeRate } from "./hooks/useTxFeeRate";

const newFeeRateRules = {
  required: true,
  feeRate: true,
};

const MIN_EXTRA_FEE_RATE = 1.01;
export const BumpNetworkFees = () => {
  const { txId } = useRoute<"bumpNetworkFees">().params;

  const localTx = useWalletState((state) => state.getTransaction(txId));
  const { data: transaction } = useMappedTransactionDetails({ localTx });
  const { estimatedFees } = useFeeEstimate();
  const { data: currentFeeRate } = useTxFeeRate({ transaction: localTx });
  const [feeRate, setNewFeeRate] = useState<string>();
  const newFeeRate =
    feeRate ?? (currentFeeRate + MIN_EXTRA_FEE_RATE).toFixed(2);

  const newFeeRateErrors = useMemo(() => {
    const errs = getErrorsInField(newFeeRate, newFeeRateRules);
    if (Number(newFeeRate) < currentFeeRate + 1) {
      errs.push(getMessages().min);
    }
    return errs;
  }, [currentFeeRate, newFeeRate]);

  const newFeeRateIsValid = newFeeRate && newFeeRateErrors.length === 0;
  const overpayingBy = Number(newFeeRate) / estimatedFees.fastestFee - 1;
  const sendingAmount = localTx ? localTx.sent - localTx.received : 0;

  if (!transaction) return <BitcoinLoading />;

  return (
    <Screen header={<BumpNetworkFeesHeader />}>
      <PeachScrollView
        style={tw`flex-1 w-full h-full`}
        contentContainerStyle={tw`justify-center flex-1`}
        contentStyle={[tw`gap-3`, tw`md:gap-5`]}
      >
        <CurrentFee fee={currentFeeRate} />
        <Divider />
        <View style={tw`flex-row items-center justify-between gap-6 px-2`}>
          <TouchableOpacity
            onPress={() => setNewFeeRate(estimatedFees.fastestFee.toString())}
          >
            <FeeInfo
              label={i18n("wallet.bumpNetworkFees.estimated.nextBlock")}
              fee={estimatedFees.fastestFee}
              isError={overpayingBy >= 1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFeeRate(estimatedFees.halfHourFee.toString())}
          >
            <FeeInfo
              label={i18n("wallet.bumpNetworkFees.estimated.halfHourFee")}
              fee={estimatedFees.halfHourFee}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFeeRate(estimatedFees.hourFee.toString())}
          >
            <FeeInfo
              label={i18n("wallet.bumpNetworkFees.estimated.hourFee")}
              fee={estimatedFees.hourFee}
            />
          </TouchableOpacity>
        </View>

        <Divider />
        <NewFee {...{ newFeeRate, setNewFeeRate, overpayingBy }} />
      </PeachScrollView>
      <BumpNetworkFeesButton
        {...{ transaction, currentFeeRate, newFeeRate, sendingAmount }}
        disabled={!newFeeRateIsValid}
      />
    </Screen>
  );
};

function BumpNetworkFeesHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="rbf" />);
  return (
    <Header
      title={i18n("wallet.bumpNetworkFees.title")}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  );
}

type Props = {
  transaction?: Transaction | null;
  currentFeeRate: string | number;
  newFeeRate: string | number;
  sendingAmount: number;
  disabled?: boolean;
};
function BumpNetworkFeesButton({
  transaction,
  currentFeeRate,
  newFeeRate,
  sendingAmount,
  disabled,
}: Props) {
  const bumpFees = useBumpFees({
    transaction,
    currentFeeRate: Number(currentFeeRate),
    newFeeRate: Number(newFeeRate),
    sendingAmount,
  });

  return (
    <Button style={tw`self-center`} disabled={disabled} onPress={bumpFees}>
      {i18n("confirm")}
    </Button>
  );
}
