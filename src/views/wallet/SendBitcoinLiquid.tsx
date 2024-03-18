import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { LiquidAddressInput } from "../../components/inputs/LiquidAddressInput";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { useHandleTransactionError } from "../../hooks/error/useHandleTransactionError";
import { useLiquidFeeEstimate } from "../../hooks/query/useLiquidFeeEstimate";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import { selectUTXONewestFirst } from "../../utils/blockchain/selectUTXONewestFirst";
import { removeNonDigits } from "../../utils/format/removeNonDigits";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { ceil } from "../../utils/math/ceil";
import { parseError } from "../../utils/parseError";
import { rules } from "../../utils/validation/rules";
import { buildTransactionWithFeeRate } from "../../utils/wallet/liquid/buildTransactionWithFeeRate";
import { peachLiquidWallet } from "../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { goToShiftCrypto } from "../../utils/web/goToShiftCrypto";
import { CustomFeeItem } from "../settings/components/networkFees/CustomFeeItem";
import { EstimatedFeeItem } from "../settings/components/networkFees/EstimatedFeeItem";
import { UTXOAddress } from "./components";
import { WithdrawalConfirmationLiquidPopup } from "./components/WithdrawalConfirmationLiquidPopup";
import { useUTXOs } from "./hooks";
import { useSyncLiquidWallet } from "./hooks/useSyncLiquidWallet";

export const SendBitcoinLiquid = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const { estimatedFees } = useLiquidFeeEstimate();
  const [feeRate, setFee] = useState<number | undefined>(
    estimatedFees.fastestFee,
  );
  const handleTransactionError = useHandleTransactionError();
  const showErrorBanner = useShowErrorBanner();

  const setPopup = useSetPopup();
  const balance = useLiquidWalletState((state) => state.balance);
  const maxAmount = balance || 0;
  const onAmountChange = (newText: string) => {
    const newNumber = Number(removeNonDigits(newText) || "0");
    const newValue = Math.min(newNumber, maxAmount);
    setAmount(newValue);
  };

  const sendTransaction = () => {
    if (!feeRate || !peachLiquidWallet) return;
    try {
      const transaction = buildTransactionWithFeeRate({
        recipients: [{ address, amount }],
        feeRate,
        inputs: selectUTXONewestFirst(peachLiquidWallet.utxos, amount),
      });

      setPopup(
        <WithdrawalConfirmationLiquidPopup
          {...{
            address,
            amount,
            transaction,
            fee: ceil(transaction.virtualSize() * feeRate),
            feeRate,
          }}
        />,
      );
    } catch (e) {
      const error = parseError(e);
      if (!Array.isArray(error)) {
        showErrorBanner(error);
      } else {
        handleTransactionError(e);
      }
    }
  };

  const isFormValid = useMemo(
    () => rules.liquidAddress(address) && amount !== 0 && !!feeRate,
    [address, amount, feeRate],
  );

  return (
    <Screen header={<SendBitcoinHeader />}>
      <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}>
        <View style={[tw`pb-11 gap-4`, tw`md:pb-14`]}>
          <Section title={i18n("wallet.sendBitcoin.to")}>
            <LiquidAddressInput value={address} onChangeText={setAddress} />
          </Section>

          <HorizontalLine />

          <Section
            title={i18n("wallet.sendBitcoin.amount")}
            action={{
              label: i18n("wallet.sendBitcoin.sendMax"),
              onPress: () => {
                setAmount(maxAmount);
              },
            }}
          >
            <BTCAmountInput
              chain="liquid"
              value={amount.toString()}
              onChangeText={onAmountChange}
              size="medium"
              textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
              containerStyle={[
                tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
                tw`border bg-primary-background-light border-black-65`,
              ]}
            />
          </Section>

          <HorizontalLine />

          <Section title={i18n("wallet.sendBitcoin.fee")}>
            <Fees updateFee={setFee} />
          </Section>

          <SelectedUTXOs />
        </View>

        <SendBitcoinSlider
          onConfirm={sendTransaction}
          isFormValid={isFormValid}
        />
      </PeachScrollView>
    </Screen>
  );
};

function SendBitcoinSlider({
  onConfirm,
  isFormValid,
}: {
  onConfirm: () => void;
  isFormValid: boolean;
}) {
  const { data: isSynced } = useSyncLiquidWallet();

  return (
    <ConfirmSlider
      label1={i18n("wallet.sendBitcoin.send")}
      onConfirm={onConfirm}
      enabled={isFormValid && isSynced}
    />
  );
}

type SectionProps = {
  title?: string;
  action?: {
    onPress: () => void;
    label: string;
  };
  children: React.ReactNode;
};
function Section({ title, action, children }: SectionProps) {
  return (
    <View style={tw``}>
      <View style={tw`flex-row items-center justify-between px-10px`}>
        <PeachText style={tw`input-title`}>{title}</PeachText>
        {action && (
          <TouchableOpacity onPress={action.onPress}>
            <PeachText style={tw`text-primary-main`}>{action.label}</PeachText>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw``}>{children}</View>
    </View>
  );
}

const feeRates = ["fastestFee", "halfHourFee", "hourFee", "custom"] as const;

function Fees({ updateFee }: { updateFee: (fee: number | undefined) => void }) {
  const [selectedFeeRate, setSelectedFeeRate] =
    useState<(typeof feeRates)[number]>("fastestFee");
  const [customFeeRate, setCustomFeeRate] = useState("");
  const { estimatedFees } = useLiquidFeeEstimate();

  const onFeeRateChange = (feeRate: (typeof feeRates)[number]) => {
    updateFee(
      feeRate === "custom"
        ? customFeeRate === ""
          ? undefined
          : Number(customFeeRate)
        : estimatedFees[feeRate],
    );
  };

  const updateCustomFeeRate = (feeRate: string) => {
    setCustomFeeRate(feeRate);
    updateFee(feeRate === "" ? undefined : Number(feeRate));
  };

  const onButtonPress = (feeRate: (typeof feeRates)[number]) => {
    setSelectedFeeRate(feeRate);
    onFeeRateChange(feeRate);
  };

  const options = feeRates.map((feeRate) => ({
    value: feeRate,
    display:
      feeRate === "custom" ? (
        <CustomFeeItem
          customFeeRate={customFeeRate}
          setCustomFeeRate={updateCustomFeeRate}
          disabled={selectedFeeRate !== "custom"}
        />
      ) : (
        <EstimatedFeeItem
          feeRate={feeRate}
          estimatedFees={estimatedFees[feeRate]}
        />
      ),
  }));

  return (
    <RadioButtons
      items={options}
      selectedValue={selectedFeeRate}
      onButtonPress={onButtonPress}
    />
  );
}

function SendBitcoinHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<WithdrawingFundsPopup />);
  return (
    <Header
      title={i18n("wallet.sendBitcoin.title")}
      icons={[
        {
          ...headerIcons.help,
          onPress: showHelp,
          accessibilityHint: i18n("help"),
        },
      ]}
    />
  );
}

function WithdrawingFundsPopup() {
  return (
    <InfoPopup
      title={i18n("wallet.withdraw.help.title")}
      content={
        <ParsedPeachText
          parse={[
            {
              pattern: new RegExp(i18n("wallet.withdraw.help.text.link"), "u"),
              style: tw`underline`,
              onPress: goToShiftCrypto,
            },
          ]}
        >
          {i18n("wallet.withdraw.help.text")}
        </ParsedPeachText>
      }
    />
  );
}

function SelectedUTXOs() {
  const { selectedUTXOs } = useUTXOs();
  if (selectedUTXOs.length === 0) return null;

  return (
    <>
      <HorizontalLine />
      <Section title={i18n("wallet.sendBitcoin.sendingFrom.coins")}>
        <View style={tw`px-10px`}>
          {selectedUTXOs.map(({ txout: { script } }) => (
            <UTXOAddress key={script.id} script={script} />
          ))}
        </View>
      </Section>
    </>
  );
}
