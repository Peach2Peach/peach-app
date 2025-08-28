import { memo } from "react";
import { View } from "react-native";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { FixedHeightText } from "../text/FixedHeightText";
import { infoContainerStyle } from "./infoContainerStyle";

export const BitcoinAmountInfo = memo(
  ({ amount, premium }: { amount: number; premium?: number }) => (
    <View style={[infoContainerStyle, tw`gap-6px`]}>
      <BTCAmount size="small" amount={amount} />
      {premium !== undefined && (
        <FixedHeightText style={tw`body-m text-black-65`} height={17}>
          {Math.abs(premium)}%{" "}
          {i18n(
            premium > 0 ? "offer.summary.premium" : "offer.summary.discount",
          )}
        </FixedHeightText>
      )}
    </View>
  ),
);
