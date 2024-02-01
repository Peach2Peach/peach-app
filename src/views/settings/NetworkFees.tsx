import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useSetPopup } from "../../components/popup/Popup";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { CustomFeeItem } from "./components/networkFees/CustomFeeItem";
import { EstimatedFeeItem } from "./components/networkFees/EstimatedFeeItem";
import { useNetworkFeesSetup } from "./hooks/useNetworkFeesSetup";

const estimatedFeeRates = [
  "fastestFee",
  "halfHourFee",
  "hourFee",
  "custom",
] as const;

export const NetworkFees = () => {
  const { estimatedFees } = useFeeEstimate();
  const {
    selectedFeeRate,
    setSelectedFeeRate,
    customFeeRate,
    setCustomFeeRate,
    submit,
    isValid,
    feeRateSet,
  } = useNetworkFeesSetup();

  const options = estimatedFeeRates.map((rate) => ({
    value: rate,
    display:
      rate === "custom" ? (
        <CustomFeeItem
          {...{
            customFeeRate,
            setCustomFeeRate,
            disabled: selectedFeeRate !== "custom",
          }}
        />
      ) : (
        <EstimatedFeeItem
          {...{ feeRate: rate, estimatedFees: estimatedFees[rate] }}
        />
      ),
  }));

  return (
    <Screen header={<NetworkFeesHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-1`}>
        <RadioButtons
          items={options}
          selectedValue={selectedFeeRate}
          onButtonPress={setSelectedFeeRate}
        />
        <HorizontalLine style={tw`mt-8`} />
        <PeachText style={tw`mt-4 text-center text-black-65`}>
          {i18n("settings.networkFees.averageFees")}
        </PeachText>
        <PeachText style={tw`text-center subtitle-1`}>
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
          <PeachText>{i18n("help.networkFees.description.1")}</PeachText>
          <PeachText>{i18n("help.networkFees.description.2")}</PeachText>
        </View>
      }
    />
  );
}
