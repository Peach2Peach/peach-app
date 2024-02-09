import { Fragment } from "react";
import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { PeachText } from "../components/text/PeachText";
import { HorizontalLine } from "../components/ui/HorizontalLine";
import tw from "../styles/tailwind";
import { getTradeBreakdown } from "../utils/bitcoin/getTradeBreakdown";
import { showAddress } from "../utils/blockchain/showAddress";
import { showTransaction } from "../utils/blockchain/showTransaction";
import i18n from "../utils/i18n";
import { isLiquidAddress } from "../utils/validation/rules";
import { getLiquidNetwork } from "../utils/wallet/getLiquidNetwork";

export function TradeBreakdownPopup({ contract }: { contract: Contract }) {
  const network = isLiquidAddress(contract.releaseAddress, getLiquidNetwork()) ? 'liquid' : 'bitcoin';
  const viewInExplorer = () =>
    contract.releaseTxId
      ? showTransaction(contract.releaseTxId, network)
      : showAddress(contract.escrow);
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
}: Contract) {
  const { totalAmount, peachFee, networkFee, amountReceived } =
    getTradeBreakdown({
      releaseTransaction,
      releaseAddress,
      inputAmount: amount,
    });

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
                <BTCAmount amount={item.amount} size="small" />
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
