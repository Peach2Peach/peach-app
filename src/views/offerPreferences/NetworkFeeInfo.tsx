import { View } from "react-native";
import { TouchableIcon } from "../../components/TouchableIcon";
import { PeachText } from "../../components/text/PeachText";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { EstimatedFeeItem } from "../settings/components/networkFees/EstimatedFeeItem";
import { Section } from "./components/Section";

export function NetworkFeeInfo({ type }: { type: "buy" | "sell" }) {
  const { user } = useSelfUser();
  const feeRate = user?.feeRate || "halfHourFee";
  const feeEstimate = useFeeEstimate();
  const estimatedFeeRate =
    typeof feeRate === "number" ? feeRate : feeEstimate.estimatedFees[feeRate];
  const navigation = useStackNavigation();
  const onPress = () => navigation.navigate("networkFees");
  if (!estimatedFeeRate || (user?.isBatchingEnabled && type === "buy"))
    return null;
  return (
    <Section.Container
      style={[
        tw`flex-row justify-between`,
        type === "buy" ? tw`bg-success-mild-1` : tw`bg-primary-background-dark`,
      ]}
    >
      <PeachText style={tw`subtitle-1`}>network fees:</PeachText>
      <View style={tw`flex-row items-center gap-2`}>
        {typeof feeRate === "number" ? (
          <PeachText style={tw`subtitle-1`}>
            {i18n("settings.networkFees.custom")} -{" "}
            <PeachText style={tw`text-black-65 ml-0.5`}>
              ({i18n("settings.networkFees.xSatsPerByte", String(feeRate))})
            </PeachText>
          </PeachText>
        ) : (
          <EstimatedFeeItem
            feeRate={feeRate}
            estimatedFees={feeEstimate.estimatedFees[feeRate]}
          />
        )}
        <TouchableIcon id="bitcoin" onPress={onPress} />
      </View>
    </Section.Container>
  );
}
