import { Fragment } from "react";
import { View } from "react-native";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { PeachText } from "../text/PeachText";
import { HorizontalLine } from "../ui/HorizontalLine";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

type TradeBreakdownTableProps = {
  amount: number;
  peachFee: number;
  totalAmount: number;
  networkFee: number;
  amountReceived: number;
};

export function TradeBreakdownTable({
  amount,
  peachFee,
  totalAmount,
  networkFee,
  amountReceived,
}: TradeBreakdownTableProps) {
  const data = [
    [
      { text: i18n("tradeComplete.popup.tradeBreakdown.sellerAmount"), amount },
      {
        text: i18n("tradeComplete.popup.tradeBreakdown.peachFees"),
        amount: peachFee,
      },
    ],
    [
      {
        text: i18n("tradeComplete.popup.tradeBreakdown.tradeAmount"),
        amount: totalAmount - peachFee,
      },
      {
        text: i18n("tradeComplete.popup.tradeBreakdown.networkFees"),
        amount: networkFee,
      },
    ],
    [
      {
        text: i18n("tradeComplete.popup.tradeBreakdown.youGet"),
        amount: amountReceived,
      },
    ],
  ];

  return (
    <View style={tw`gap-4`}>
      {data.map((sectionData, index) => (
        <Fragment key={`tradeBreakdownSection-${index}`}>
          <View style={tw`gap-3`}>
            {sectionData.map((item) => (
              <View
                style={tw`flex-row items-center justify-between`}
                key={item.text}
              >
                <PeachText style={tw`subtitle-1 text-black-65 shrink`}>
                  {item.text}
                </PeachText>
                <BTCAmount
                  textStyle={tw`text-black-100`}
                  amount={item.amount}
                  size="small"
                />
              </View>
            ))}
          </View>
          {index !== data.length - 1 && (
            <HorizontalLine style={tw`self-end bg-black-65 w-45`} />
          )}
        </Fragment>
      ))}
    </View>
  );
}
