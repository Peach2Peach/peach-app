import { Dispatch } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { FeeInfo } from "./FeeInfo";

type Props = {
  estimatedFees: FeeRecommendation;
  setFeeRate: Dispatch<string>;
  isOverpaying?: boolean;
};

export const FeeEstimates = ({
  estimatedFees,
  setFeeRate,
  isOverpaying,
}: Props) => (
  <View style={tw`flex-row items-center justify-between gap-6 px-2`}>
    <TouchableOpacity
      onPress={() => setFeeRate(estimatedFees.fastestFee.toString())}
    >
      <FeeInfo
        label={i18n("wallet.bumpNetworkFees.estimated.nextBlock")}
        fee={estimatedFees.fastestFee}
        isError={isOverpaying}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFeeRate(estimatedFees.halfHourFee.toString())}
    >
      <FeeInfo
        label={i18n("wallet.bumpNetworkFees.estimated.halfHourFee")}
        fee={estimatedFees.halfHourFee}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFeeRate(estimatedFees.hourFee.toString())}
    >
      <FeeInfo
        label={i18n("wallet.bumpNetworkFees.estimated.hourFee")}
        fee={estimatedFees.hourFee}
      />
    </TouchableOpacity>
  </View>
);
