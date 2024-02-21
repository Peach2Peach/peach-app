import { Dispatch } from "react";
import { View } from "react-native";
import { NumberInput } from "../../../../components/inputs/NumberInput";
import { PeachText } from "../../../../components/text/PeachText";
import { CENT } from "../../../../constants";
import tw from "../../../../styles/tailwind";
import { round } from "../../../../utils/math/round";
import { tolgee } from "../../../../tolgee";

type Props = {
  newFeeRate: string;
  setNewFeeRate: Dispatch<string>;
  overpayingBy?: number;
};

export const NewFee = ({
  newFeeRate,
  setNewFeeRate,
  overpayingBy = 0,
}: Props) => (
  <View style={tw`items-center gap-10px`}>
    <View
      style={tw`flex-row items-center self-stretch justify-center gap-2 pt-2`}
    >
      <PeachText style={tw`subtitle-1`}>
        {tolgee.t("wallet.bumpNetworkFees.newFee", { ns: "wallet" })}
      </PeachText>
      <View style={tw`h-9`}>
        <NumberInput
          style={tw`w-24 h-9`}
          value={newFeeRate}
          decimals={2}
          placeholder=""
          onChangeText={setNewFeeRate}
          required={true}
        />
      </View>
      <PeachText style={tw`text-center text-black-50`}>
        {tolgee.t("satPerByte", { ns: "global" })}
      </PeachText>
    </View>
    <PeachText
      style={[
        tw`text-center text-primary-main`,
        overpayingBy < 1 && tw`opacity-0`,
      ]}
    >
      {tolgee.t("wallet.bumpNetworkFees.overPayingBy", {
        ns: "wallet",
        percentage: String(round(overpayingBy * CENT)),
      })}
    </PeachText>
  </View>
);
