import { useTranslate } from "@tolgee/react";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { BitcoinAddressInput } from "../../components/inputs/BitcoinAddressInput";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { estimatedFeeRates } from "../../constants";
import { useHandleTransactionError } from "../../hooks/error/useHandleTransactionError";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import { removeNonDigits } from "../../utils/format/removeNonDigits";
import { headerIcons } from "../../utils/layout/headerIcons";
import { rules } from "../../utils/validation/rules";
import { peachWallet } from "../../utils/wallet/setWallet";
import { goToShiftCrypto } from "../../utils/web/goToShiftCrypto";
import { CustomFeeItem } from "../settings/components/networkFees/CustomFeeItem";
import { EstimatedFeeItem } from "../settings/components/networkFees/EstimatedFeeItem";
import { UTXOAddress } from "./components";
import { WithdrawalConfirmationPopup } from "./components/WithdrawalConfirmationPopup";
import { useUTXOs } from "./hooks";
import { useSyncWallet } from "./hooks/useSyncWallet";

export const SendBitcoin = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [shouldDrainWallet, setShouldDrainWallet] = useState(false);
  const { estimatedFees } = useFeeEstimate();
  const [feeRate, setFee] = useState<number | undefined>(
    estimatedFees.fastestFee,
  );
  const handleTransactionError = useHandleTransactionError();
  const setPopup = useSetPopup();

  const { selectedUTXOs } = useUTXOs();
  const { t } = useTranslate("wallet");

  const maxAmount = selectedUTXOs.length
    ? selectedUTXOs.reduce((acc, utxo) => acc + utxo.txout.value, 0)
    : peachWallet?.balance || 0;

  const onAmountChange = (newText: string) => {
    setShouldDrainWallet(false);
    const newNumber = Number(removeNonDigits(newText) || "0");
    const newValue = Math.min(newNumber, maxAmount);
    setAmount(newValue);
  };

  const sendTrasaction = async () => {
    if (!feeRate || !peachWallet) return;
    try {
      const { psbt } = await peachWallet.buildFinishedTransaction({
        address,
        amount,
        feeRate,
        shouldDrainWallet,
        utxos: selectedUTXOs,
      });
      const fee = await psbt.feeAmount();

      setPopup(
        <WithdrawalConfirmationPopup
          {...{ address, amount, psbt, fee, feeRate }}
        />,
      );
    } catch (e) {
      handleTransactionError(e);
    }
  };

  const isFormValid = useMemo(
    () => rules.bitcoinAddress(address) && amount !== 0 && !!feeRate,
    [address, amount, feeRate],
  );

  return (
    <Screen header={<SendBitcoinHeader />}>
      <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}>
        <View style={[tw`pb-11 gap-4`, tw`md:pb-14`]}>
          <Section title={t("wallet.sendBitcoin.to")}>
            <BitcoinAddressInput value={address} onChangeText={setAddress} />
          </Section>

          <HorizontalLine />

          <Section
            title={t("wallet.sendBitcoin.amount")}
            action={{
              label: t("wallet.sendBitcoin.sendMax"),
              onPress: () => {
                setShouldDrainWallet(true);
                setAmount(maxAmount);
              },
            }}
          >
            <BTCAmountInput
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

          <Section title={t("wallet.sendBitcoin.fee")}>
            <Fees updateFee={setFee} />
          </Section>

          <SelectedUTXOs />
        </View>

        <SendBitcoinSlider
          onConfirm={sendTrasaction}
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
  const { t } = useTranslate("wallet");
  const { isPending } = useSyncWallet({ enabled: true });

  return (
    <ConfirmSlider
      label1={t("wallet.sendBitcoin.send")}
      onConfirm={onConfirm}
      enabled={isFormValid && !isPending}
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

function Fees({ updateFee }: { updateFee: (fee: number | undefined) => void }) {
  const [selectedFeeRate, setSelectedFeeRate] =
    useState<(typeof estimatedFeeRates)[number]>("fastestFee");
  const [customFeeRate, setCustomFeeRate] = useState("");
  const { estimatedFees } = useFeeEstimate();

  const onFeeRateChange = (feeRate: (typeof estimatedFeeRates)[number]) => {
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

  const onButtonPress = (feeRate: (typeof estimatedFeeRates)[number]) => {
    setSelectedFeeRate(feeRate);
    onFeeRateChange(feeRate);
  };

  const options = estimatedFeeRates.map((feeRate) => ({
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
  const navigation = useStackNavigation();
  const { t } = useTranslate("wallet");

  return (
    <Header
      title={t("wallet.sendBitcoin.title")}
      icons={[
        {
          ...headerIcons.listFlipped,
          onPress: () => navigation.navigate("coinSelection"),
          accessibilityHint: `${t("goTo", { ns: "global" })} ${t("wallet.coinControl.title")}`,
        },
        {
          ...headerIcons.help,
          onPress: showHelp,
          accessibilityHint: t("help", { ns: "help" }),
        },
      ]}
    />
  );
}

function WithdrawingFundsPopup() {
  const { t } = useTranslate("wallet");

  return (
    <InfoPopup
      title={t("wallet.withdraw.help.title")}
      content={
        <ParsedPeachText
          parse={[
            {
              pattern: new RegExp(t("wallet.withdraw.help.text.link"), "u"),
              style: tw`underline`,
              onPress: goToShiftCrypto,
            },
          ]}
        >
          {t("wallet.withdraw.help.text")}
        </ParsedPeachText>
      }
    />
  );
}

function SelectedUTXOs() {
  const { t } = useTranslate("wallet");
  const { selectedUTXOs } = useUTXOs();
  if (selectedUTXOs.length === 0) return null;

  return (
    <>
      <HorizontalLine />
      <Section title={t("wallet.sendBitcoin.sendingFrom.coins")}>
        <View style={tw`px-10px`}>
          {selectedUTXOs.map(({ txout: { script } }) => (
            <UTXOAddress key={script.id} script={script} />
          ))}
        </View>
      </Section>
    </>
  );
}
