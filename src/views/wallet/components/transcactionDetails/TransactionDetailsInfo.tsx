import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { Transaction } from "bitcoinjs-lib";
import { View } from "react-native";
import { Divider } from "../../../../components/Divider";
import { Bubble } from "../../../../components/bubble/Bubble";
import { CopyableSummaryItem } from "../../../../components/summaryItem";
import { ConfirmationSummaryItem } from "../../../../components/summaryItem/ConfirmationSummaryItem";
import tw from "../../../../styles/tailwind";
import { getBitcoinAddressParts } from "../../../../utils/bitcoin/getBitcoinAddressParts";
import { contractIdToHex } from "../../../../utils/contract/contractIdToHex";
import { toShortDateFormat } from "../../../../utils/date/toShortDateFormat";
import i18n from "../../../../utils/i18n";
import { offerIdToHex } from "../../../../utils/offer/offerIdToHex";
import { useTransactionDetailsInfoSetup } from "../../hooks/useTransactionDetailsInfoSetup";
import { AddressLabelInput } from "../AddressLabelInput";
import { OutputInfo } from "./OutputInfo";
import { TransactionETASummaryItem } from "./TransactionETASummaryItem";

type Props = {
  localTx: TransactionDetails;
  transactionDetails: Transaction;
  transactionSummary: TransactionSummary;
};

export const TransactionDetailsInfo = ({
  localTx,
  transactionDetails,
  transactionSummary,
}: Props) => {
  const { confirmed, height, date } = transactionSummary;
  const { receivingAddress, canBumpFees, goToBumpNetworkFees, openInExplorer } =
    useTransactionDetailsInfoSetup({
      transactionDetails,
      transactionSummary,
    });
  const addressParts =
    receivingAddress && getBitcoinAddressParts(receivingAddress);

  return (
    <View style={tw`gap-4`}>
      {transactionSummary.type === "DEPOSIT" &&
        addressParts &&
        receivingAddress && (
          <AddressLabelInput
            address={receivingAddress}
            fallback={`${addressParts.one}${addressParts.two}...${addressParts.four}`}
          />
        )}
      <Divider />

      <OutputInfo
        {...{ transactionDetails, transactionSummary, receivingAddress }}
      />

      <Divider />

      <ConfirmationSummaryItem confirmed={confirmed} />
      {confirmed ? (
        <>
          <CopyableSummaryItem title={i18n("block")} text={String(height)} />
          <CopyableSummaryItem
            title={i18n("time")}
            text={toShortDateFormat(date)}
          />
        </>
      ) : (
        <TransactionETASummaryItem transaction={localTx} />
      )}

      {canBumpFees && (
        <Bubble
          color="primary"
          onPress={goToBumpNetworkFees}
          iconId="chevronsUp"
          iconSize={16}
          style={tw`self-center`}
        >
          {i18n("wallet.bumpNetworkFees.button")}
        </Bubble>
      )}

      <Divider />

      <Bubble
        color="primary"
        style={tw`self-center`}
        ghost
        iconId="externalLink"
        iconSize={16}
        onPress={openInExplorer}
      >
        {i18n("transaction.viewInExplorer")}
      </Bubble>
    </View>
  );
};

export function getOfferDataId(offer: OfferData) {
  if (offer.contractId) return contractIdToHex(offer.contractId);
  if (offer.offerId) return offerIdToHex(offer.offerId);
  return "unknown";
}
