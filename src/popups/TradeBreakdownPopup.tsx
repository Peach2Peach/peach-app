import { GROUPHUG_URL, NETWORK } from "@env";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { ActivityIndicator, View } from "react-native";
import { z } from "zod";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { PeachText } from "../components/text/PeachText";
import { HorizontalLine } from "../components/ui/HorizontalLine";
import tw from "../styles/tailwind";
import { getTradeBreakdown } from "../utils/bitcoin/getTradeBreakdown";
import { showAddress } from "../utils/bitcoin/showAddress";
import { showTransaction } from "../utils/bitcoin/showTransaction";
import fetch from "../utils/fetch";
import i18n from "../utils/i18n";

export function TradeBreakdownPopup({ contract }: { contract: Contract }) {
  const viewInExplorer = () =>
    contract.releaseTxId
      ? showTransaction(contract.releaseTxId, NETWORK)
      : showAddress(contract.escrow, NETWORK);

  return (
    <PopupComponent
      title={i18n("tradeComplete.popup.tradeBreakdown.title")}
      content={<TradeBreakdown {...contract} />}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={i18n("tradeComplete.popup.tradeBreakdown.explorer")}
            onPress={viewInExplorer}
            iconId="externalLink"
            reverseOrder
          />
        </>
      }
    />
  );
}

function TradeBreakdown({
  releaseTransaction,
  releaseAddress,
  amount,
  batchId,
}: Contract) {
  if (batchId) {
    return <BatchTradeBreakdown batchId={batchId} />;
  }
  const { totalAmount, peachFee, networkFee, amountReceived } =
    getTradeBreakdown({
      releaseTransaction,
      releaseAddress,
      inputAmount: amount,
    });

  return (
    <TradeBreakdownTable
      peachFee={peachFee}
      totalAmount={totalAmount}
      networkFee={networkFee}
      amountReceived={amountReceived}
    />
  );
}

const PSBTInfoSchema = z.object({
  inputValue: z.number().min(0),
  outputValue: z.number().min(0),
  networkFee: z.number().min(0),
  serviceFee: z.number().min(0),
});
function BatchTradeBreakdown({ batchId }: { batchId: string }) {
  const { data } = useQuery({
    queryKey: ["batching", "psbt", batchId, "info"],
    queryFn: async () => {
      const response = await fetch(`${GROUPHUG_URL}/v1/psbt/${batchId}/info`);
      return PSBTInfoSchema.parse(await response.json());
    },
  });
  if (!data)
    return <ActivityIndicator size="large" color={tw.color("primary-main")} />;
  return (
    <TradeBreakdownTable
      totalAmount={data.inputValue}
      amountReceived={data.outputValue}
      peachFee={data.serviceFee}
      networkFee={data.networkFee}
    />
  );
}

type TradeBreakdownTableProps = {
  peachFee: number;
  totalAmount: number;
  networkFee: number;
  amountReceived: number;
};

function TradeBreakdownTable({
  peachFee,
  totalAmount,
  networkFee,
  amountReceived,
}: TradeBreakdownTableProps) {
  const data = [
    [
      {
        text: i18n("tradeComplete.popup.tradeBreakdown.sellerAmount"),
        amount: totalAmount,
      },
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
