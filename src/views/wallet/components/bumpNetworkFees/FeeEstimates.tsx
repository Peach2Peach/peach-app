import { Dispatch } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "../../../../styles/tailwind";
import { FeeInfo } from "./FeeInfo";
import { tolgee } from "../../../../tolgee";

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
        label={tolgee.t("wallet.bumpNetworkFees.estimated.nextBlock", {
          ns: "wallet",
        })}
        fee={estimatedFees.fastestFee}
        isError={isOverpaying}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFeeRate(estimatedFees.halfHourFee.toString())}
    >
      <FeeInfo
        label={tolgee.t("wallet.bumpNetworkFees.estimated.halfHourFee", {
          ns: "wallet",
        })}
        fee={estimatedFees.halfHourFee}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFeeRate(estimatedFees.hourFee.toString())}
    >
      <FeeInfo
        label={tolgee.t("wallet.bumpNetworkFees.estimated.hourFee", {
          ns: "wallet",
        })}
        fee={estimatedFees.hourFee}
      />
    </TouchableOpacity>
  </View>
);
