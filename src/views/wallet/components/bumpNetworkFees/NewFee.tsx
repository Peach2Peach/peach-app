import { Dispatch } from "react";
import { View } from "react-native";
import { NumberInput } from "../../../../components/inputs/NumberInput";
import { PeachText } from "../../../../components/text/PeachText";
import { CENT } from "../../../../constants";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { round } from "../../../../utils/math/round";

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
        {i18n("wallet.bumpNetworkFees.newFee")}
      </PeachText>
      <View style={tw`h-9`}>
        <NumberInput
          style={tw`w-24 h-9`}
          value={newFeeRate}
          // decimals={2}
          placeholder=""
          onChangeText={setNewFeeRate}
          required={true}
        />
      </View>
      <PeachText style={tw`text-center text-black-50`}>
        {i18n("satPerByte")}
      </PeachText>
    </View>
    <PeachText
      style={[
        tw`text-center text-primary-main`,
        overpayingBy < 1 && tw`opacity-0`,
      ]}
    >
      {i18n(
        "wallet.bumpNetworkFees.overPayingBy",
        String(round(overpayingBy * CENT)),
      )}
    </PeachText>
  </View>
);
