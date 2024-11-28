import { useCallback, useState } from "react";
import { View } from "react-native";
import { Header } from "../../../components/Header";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { Button } from "../../../components/buttons/Button";
import { RadioButtons } from "../../../components/inputs/RadioButtons";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PeachText } from "../../../components/text/PeachText";
import { useSetToast } from "../../../components/toast/Toast";
import { HorizontalLine } from "../../../components/ui/HorizontalLine";
import { useFeeEstimate } from "../../../hooks/query/useFeeEstimate";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { InfoPopup } from "../../../popups/InfoPopup";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { headerIcons } from "../../../utils/layout/headerIcons";
import { useUpdateUser } from "../../../utils/peachAPI/useUpdateUser";
import { CustomFeeItem } from "../components/networkFees/CustomFeeItem";
import { EstimatedFeeItem } from "../components/networkFees/EstimatedFeeItem";

const estimatedFeeRates = [
  "fastestFee",
  "halfHourFee",
  "hourFee",
  "custom",
] as const;

const customFeeRules = {
  required: true,
  feeRate: true,
};

export const NetworkFees = () => {
  const { estimatedFees } = useFeeEstimate();
  const { user } = useSelfUser();
  const feeRate = user?.feeRate;
  const { isDarkMode } = useThemeStore();

  const defaultFeeRate = feeRate
    ? typeof feeRate === "number"
      ? "custom"
      : feeRate
    : "halfHourFee";
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | "custom">();
  const displayRate = selectedFeeRate ?? defaultFeeRate;

  const defaultCustomFeeRate =
    typeof feeRate === "number" ? feeRate.toString() : "";
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] =
    useValidatedState<string | undefined>(undefined, customFeeRules);
  const displayCustomRate = customFeeRate ?? defaultCustomFeeRate;

  const finalFeeRate =
    displayRate === "custom" ? Number(displayCustomRate) : displayRate;

  const setToast = useSetToast();
  const { mutate } = useUpdateUser();

  const onChangeCustomFeeRate = (value: string) =>
    setCustomFeeRate(
      !value || isNaN(Number(value)) || value === "0" ? "" : value,
    );

  const submit = useCallback(() => {
    mutate(
      { feeRate: finalFeeRate },
      {
        onError: (err) => setToast({ msgKey: err.message, color: "red" }),
      },
    );
  }, [finalFeeRate, mutate, setToast]);

  const isValid = selectedFeeRate !== "custom" || isValidCustomFeeRate;
  const feeRateSet =
    displayRate === "custom"
      ? feeRate === Number(displayCustomRate)
      : feeRate === displayRate;

  const options = estimatedFeeRates.map((rate) => ({
    value: rate,
    display:
      rate === "custom" ? (
        <CustomFeeItem
          customFeeRate={displayCustomRate}
          setCustomFeeRate={onChangeCustomFeeRate}
          disabled={displayRate !== "custom"}
        />
      ) : (
        <EstimatedFeeItem feeRate={rate} estimatedFees={estimatedFees[rate]} />
      ),
  }));

  return (
    <Screen header={<NetworkFeesHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-1`}>
        {user?.isBatchingEnabled && (
          <PeachText
            style={tw.style(
              "py-2 text-center mb-7",
              isDarkMode ? "text-backgroundLight-light" : "text-black-100",
            )}
          >
            {i18n("settings.networkFees.payoutInfo")}
          </PeachText>
        )}
        <RadioButtons
          items={options}
          selectedValue={displayRate}
          onButtonPress={setSelectedFeeRate}
        />
        <HorizontalLine style={tw`mt-8`} />
        <PeachText style={tw.style(
            "mt-4 text-center",
            isDarkMode ? "text-backgroundLight-light" : "text-black-65",
          )}>
          {i18n("settings.networkFees.averageFees")}
        </PeachText>
        <PeachText
          style={tw.style(
            "text-center subtitle-1",
            isDarkMode ? "text-primary-mild-2" : "text-black-100",
          )}
        >
          {i18n(
            "settings.networkFees.xSatsPerByte",
            estimatedFees.economyFee.toString(),
          )}
        </PeachText>
      </PeachScrollView>
      <Button
        onPress={submit}
        disabled={!isValid || feeRateSet}
        style={tw`self-center min-w-52`}
      >
        {i18n(feeRateSet ? "settings.networkFees.feeRateSet" : "confirm")}
      </Button>
    </Screen>
  );
};

function NetworkFeesHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<NetworkFeesPopup />);
  return (
    <Header
      title={i18n("settings.networkFees")}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  );
}

function NetworkFeesPopup() {
  return (
    <InfoPopup
      title={i18n("help.networkFees.title")}
      content={
        <View style={tw`gap-2`}>
          <PeachText style={tw`text-black-100`}>{i18n("help.networkFees.description.1")}</PeachText>
          <PeachText style={tw`text-black-100`}>{i18n("help.networkFees.description.2")}</PeachText>
        </View>
      }
    />
  );
}
