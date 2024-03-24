import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { BuyOffer, SellOffer } from "../../../../peach-api/src/@types/offer";
import { Screen } from "../../../components/Screen";
import { Button } from "../../../components/buttons/Button";
import { TabbedNavigation } from "../../../components/navigation/TabbedNavigation";
import { useMessageHandler } from "../../../hooks/notifications/useMessageHandler";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import tw from "../../../styles/tailwind";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";

export const TestViewPNs = () => {
  const messageHandler = useMessageHandler();
  const queryClient = useQueryClient();
  const firstSellOffer = useMemo(
    () =>
      queryClient
        .getQueriesData<BuyOffer | SellOffer>({ queryKey: offerKeys.details() })
        .find(([, value]: [QueryKey, BuyOffer | SellOffer | undefined]) => {
          if (
            value &&
            typeof value === "object" &&
            value !== null &&
            "type" in value
          ) {
            return value.type === "ask";
          }
          return false;
        })?.[1],
    [queryClient],
  );
  const firstBuyOffer = useMemo(
    () =>
      queryClient
        .getQueriesData<BuyOffer | SellOffer>({ queryKey: offerKeys.details() })
        .find(([, value]: [QueryKey, BuyOffer | SellOffer | undefined]) => {
          if (
            value &&
            typeof value === "object" &&
            value !== null &&
            "type" in value
          ) {
            return isBuyOffer(value);
          }
          return false;
        })?.[1],
    [queryClient],
  );
  const firstContract = undefined as Contract | undefined;
  const sellOfferId = firstSellOffer?.id || "1";
  const buyOfferId = firstBuyOffer?.id || "1";
  const contractId = firstContract?.id || "1-2";

  const fakeOfferPNs = [
    {
      data: {
        type: "user.badge.unlocked",
        badges: "fastTrader,superTrader",
      },
    },
    {
      data: {
        type: "offer.escrowFunded",
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: "offer.notFunded",
        offerId: sellOfferId,
      },
      notification: {
        bodyLocArgs: ["P-123", "7"],
      },
    },
    {
      data: {
        type: "offer.fundingAmountDifferent",
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: "offer.wrongFundingAmount",
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: "offer.sellOfferExpired",
        offerId: sellOfferId,
      },
      notification: {
        bodyLocArgs: ["P-123", "14"],
      },
    },
    {
      data: {
        type: "offer.outsideRange",
        offerId: sellOfferId,
      },
      notification: {
        bodyLocArgs: ["P-123"],
      },
    },
    {
      data: {
        type: "offer.buyOfferExpired",
        offerId: buyOfferId,
      },
      notification: {
        bodyLocArgs: ["P-123", "30"],
      },
    },
    {
      data: {
        type: "offer.matchBuyer",
        offerId: buyOfferId,
      },
    },
    {
      data: {
        type: "offer.matchSeller",
        offerId: sellOfferId,
      },
    },
  ].map((pn, index) => ({ ...pn, messageId: `${index}-offer` }));
  const fakeContractPNs = [
    {
      data: {
        type: "contract.contractCreated",
        offerId: buyOfferId,
        contractId,
      },
    },
    {
      data: {
        type: "contract.seller.instantTrade",
        contractId,
      },
    },
    {
      data: {
        type: "contract.paymentMade",
        contractId,
      },
    },
    {
      data: {
        type: "contract.buyer.disputeRaised",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456", "200000"],
      },
    },
    {
      data: {
        type: "contract.seller.disputeRaised",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456", "200000"],
      },
    },
    {
      data: {
        type: "contract.seller.canceledAfterEscrowExpiry",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.buyer.paymentTimerSellerCanceled",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.buyer.paymentTimerExtended",
        contractId,
      },
    },
    {
      data: {
        type: "contract.buyer.paymentReminderSixHours",
        contractId,
      },
    },
    {
      data: {
        type: "contract.buyer.paymentTimerHasRunOut",
        contractId,
      },
    },
    {
      data: {
        type: "contract.seller.paymentTimerHasRunOut",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.buyer.paymentReminderOneHour",
        contractId,
      },
    },
    {
      data: {
        type: "contract.paymentMade",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.tradeCompleted",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.chat",
        contractId,
        isChat: "true",
      },
    },
    {
      data: {
        type: "contract.disputeResolved",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.buyer.disputeWon",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.seller.disputeWon",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.buyer.disputeLost",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.seller.disputeLost",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.canceled",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "seller.canceledAfterEscrowExpiry",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.cancelationRequest",
        contractId,
      },
      notification: {
        titleLocArgs: ["PC-123-456"],
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.cancelationRequestAccepted",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
    {
      data: {
        type: "contract.cancelationRequestRejected",
        contractId,
      },
      notification: {
        bodyLocArgs: ["PC-123-456"],
      },
    },
  ].map((pn, index) => ({ ...pn, messageId: `${index}-contract` }));
  const tabs = [
    { id: "offer", display: "offer" },
    { id: "contract", display: "contract" },
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  return (
    <Screen>
      <TabbedNavigation
        style={tw`mb-4`}
        items={tabs}
        selected={currentTab}
        select={setCurrentTab}
      />
      {currentTab.id === "offer" && (
        <FlatList
          contentContainerStyle={tw`px-6 `}
          data={fakeOfferPNs}
          renderItem={({ item }) => (
            <Button
              onPress={() =>
                messageHandler(
                  item as unknown as FirebaseMessagingTypes.RemoteMessage,
                )
              }
            >
              {item.data.type}
            </Button>
          )}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        />
      )}
      {currentTab.id === "contract" && (
        <FlatList
          contentContainerStyle={tw`px-6 `}
          data={fakeContractPNs}
          renderItem={({ item }) => (
            <Button
              onPress={() =>
                messageHandler(
                  item as unknown as FirebaseMessagingTypes.RemoteMessage,
                )
              }
            >
              {item.data.type}
            </Button>
          )}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        />
      )}
    </Screen>
  );
};
