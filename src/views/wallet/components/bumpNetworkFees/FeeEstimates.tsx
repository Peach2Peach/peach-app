import { useTranslate } from "@tolgee/react";
import { Dispatch } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "../../../../styles/tailwind";
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
}: Props) => {
  const { t } = useTranslate("wallet");

  return (
    <View style={tw`flex-row items-center justify-between gap-6 px-2`}>
      <TouchableOpacity
        onPress={() => setFeeRate(estimatedFees.fastestFee.toString())}
      >
        <FeeInfo
          label={t("wallet.bumpNetworkFees.estimated.nextBlock")}
          fee={estimatedFees.fastestFee}
          isError={isOverpaying}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setFeeRate(estimatedFees.halfHourFee.toString())}
      >
        <FeeInfo
          label={t("wallet.bumpNetworkFees.estimated.halfHourFee")}
          fee={estimatedFees.halfHourFee}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setFeeRate(estimatedFees.hourFee.toString())}
      >
        <FeeInfo
          label={t("wallet.bumpNetworkFees.estimated.hourFee")}
          fee={estimatedFees.hourFee}
        />
      </TouchableOpacity>
    </View>
  );
};
