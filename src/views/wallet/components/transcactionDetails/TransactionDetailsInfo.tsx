import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { Transaction } from "bitcoinjs-lib";
import { useState } from "react";
import { LayoutChangeEvent, TouchableOpacity, View } from "react-native";
import { Divider } from "../../../../components/Divider";
import { Icon } from "../../../../components/Icon";
import { BTCAmount } from "../../../../components/bitcoin/BTCAmount";
import { Bubble } from "../../../../components/bubble/Bubble";
import { AddressSummaryItem } from "../../../../components/summaryItem/AddressSummaryItem";
import { CopyableSummaryItem } from "../../../../components/summaryItem/CopyableSummaryItem";
import { SummaryItem } from "../../../../components/summaryItem/SummaryItem";
import { PeachText } from "../../../../components/text/PeachText";
import { CopyAble } from "../../../../components/ui/CopyAble";
import { TabBar } from "../../../../components/ui/TabBar";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import tw from "../../../../styles/tailwind";
import { getBitcoinAddressParts } from "../../../../utils/bitcoin/getBitcoinAddressParts";
import { contractIdToHex } from "../../../../utils/contract/contractIdToHex";
import { toShortDateFormat } from "../../../../utils/date/toShortDateFormat";
import i18n from "../../../../utils/i18n";
import { offerIdToHex } from "../../../../utils/offer/offerIdToHex";
import { priceFormat } from "../../../../utils/string/priceFormat";
import { useTransactionDetailsInfoSetup } from "../../hooks/useTransactionDetailsInfoSetup";
import { AddressLabelInput } from "../AddressLabelInput";
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
  const isMediumScreen = useIsMediumScreen();

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

      {!!transactionSummary.offerData.length && (
        <OfferData transactionSummary={transactionSummary} />
      )}
      <Divider />

      <SummaryItem title={i18n("amount")}>
        <View style={tw`flex-row items-center gap-2`}>
          <BTCAmount
            amount={transactionSummary.amount}
            size={isMediumScreen ? "medium" : "small"}
          />
          <CopyAble value={String(transactionSummary.amount)} />
        </View>
      </SummaryItem>
      <AddressSummaryItem address={receivingAddress} title={i18n("to")} />

      <Divider />

      <SummaryItem title={i18n("status")}>
        <TouchableOpacity
          style={tw`flex-row items-center justify-between gap-2`}
          disabled
        >
          <PeachText style={tw`subtitle-1`}>
            {i18n(`wallet.transaction.${confirmed ? "confirmed" : "pending"}`)}
          </PeachText>
          <Icon
            id={confirmed ? "checkCircle" : "clock"}
            color={tw.color(confirmed ? "success-main" : "black-50")}
            size={16}
          />
        </TouchableOpacity>
      </SummaryItem>

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

function getOfferDataId({ contractId, offerId }: OfferData) {
  if (contractId) return contractIdToHex(contractId);
  if (offerId) return offerIdToHex(offerId);
  return "unknown";
}

const Tab = createMaterialTopTabNavigator();

type OutputInfoProps = {
  transactionSummary: TransactionSummary;
};
export function OfferData({
  transactionSummary: { type, offerData },
}: OutputInfoProps) {
  const [tabsHeight, setTabsHeight] = useState(Number(tw`h-20`.height));
  const adjustHeight = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.height) return;
    const tabHeight = Math.round(event.nativeEvent.layout.height);
    setTabsHeight((prev) =>
      Math.max(prev, Number(tw`h-12`.height) + tabHeight),
    );
  };
  if (offerData.length > 1) {
    return (
      <Tab.Navigator
        style={{ height: tabsHeight }}
        sceneContainerStyle={tw`pt-4`}
        initialRouteName={getOfferDataId(offerData[0])}
        tabBar={TabBar}
      >
        {offerData.map((offer) => (
          <Tab.Screen
            key={`tab-screen-${getOfferDataId(offer)}`}
            name={getOfferDataId(offer)}
            children={() => (
              <PriceInfo
                onLayout={adjustHeight}
                price={offer.price}
                currency={offer.currency}
                type={type}
              />
            )}
          />
        ))}
      </Tab.Navigator>
    );
  }
  return (
    <PriceInfo
      price={offerData[0]?.price}
      currency={offerData[0]?.currency}
      type={type}
    />
  );
}

type OfferDataProps = {
  price?: number;
  currency?: Currency;
  type: TransactionType;
  onLayout?: (event: LayoutChangeEvent) => void;
};
function PriceInfo({ price, currency, type }: OfferDataProps) {
  if (!price || !currency || type === "REFUND") return null;
  return (
    <CopyableSummaryItem
      title={i18n("price")}
      text={`${priceFormat(price)} ${currency}`}
    />
  );
}
