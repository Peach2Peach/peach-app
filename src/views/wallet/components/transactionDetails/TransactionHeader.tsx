import { useMemo } from "react";
import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import { useContractSummaries } from "../../../../hooks/query/useContractSummaries";
import { useOfferSummaries } from "../../../../hooks/query/useOfferSummaries";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { isDefined } from "../../../../utils/validation/isDefined";
import { TransactionIcon } from "../TransactionIcon";
import { OfferIdBubble } from "./OfferIdBubble";
import { TradeIdBubble } from "./TradeIdBubble";

type Props = Pick<TransactionSummary, "type" | "offerData">;

const MEDIUM_SIZE = 56;
const SMALL_SIZE = 48;
export const TransactionHeader = ({ type, offerData }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const { offers } = useOfferSummaries();
  const { contracts } = useContractSummaries();
  const offerSummaries = useMemo(
    () =>
      offerData
        .map((offer) =>
          !offer.contractId && offer.offerId
            ? offers.find((o) => o.id === offer.offerId)
            : undefined,
        )
        .filter(isDefined),
    [offerData, offers],
  );
  const contractSummaries = useMemo(
    () =>
      offerData
        .map((offer) =>
          offer.contractId
            ? contracts.find((c) => c.id === offer.contractId)
            : undefined,
        )
        .filter(isDefined),
    [contracts, offerData],
  );
  const hasIdBubbles = offerSummaries.length + contractSummaries.length > 0;

  return (
    <View
      style={[
        tw`flex-row items-center self-center gap-4`,
        hasIdBubbles && tw`items-end`,
      ]}
    >
      <TransactionIcon
        type={type}
        size={isMediumScreen ? MEDIUM_SIZE : SMALL_SIZE}
      />
      <View style={tw`items-start shrink`}>
        <PeachText style={[tw`h6`, tw`md:h5`]}>
          {i18n(`wallet.transactionDetails.type.${type}`)}
        </PeachText>
        <View style={tw`flex-row flex-wrap gap-1`}>
          {offerSummaries.map((offer) => (
            <OfferIdBubble key={`offer-id-bubble-${offer.id}`} offer={offer} />
          ))}
          {contractSummaries.map((trade) => (
            <TradeIdBubble key={`trade-id-bubble-${trade.id}`} trade={trade} />
          ))}
        </View>
      </View>
    </View>
  );
};
