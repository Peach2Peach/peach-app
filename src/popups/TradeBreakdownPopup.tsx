import { NETWORK } from "@env";
import { Fragment } from "react";
import { View } from "react-native";
import { Contract } from "../../peach-api/src/@types/contract";
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
import i18n from "../utils/i18n";

export function TradeBreakdownPopup({ contract }: { contract: Contract }) {
  const viewInExplorer = async () => {
    if (!contract.escrow) return;
    if (contract.releaseTxId) {
      await showTransaction(contract.releaseTxId, NETWORK);
    } else {
      await showAddress(contract.escrow, NETWORK);
    }
  };
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
