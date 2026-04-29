import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  MobilePendingActionContract,
  MobilePendingActionFundEscrow,
  MobilePendingActionFundMultipleEscrow,
  MobilePendingActionRefund,
} from "../../../peach-api/src/@types/mobilePendingAction";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { statusCardStyles } from "../../components/statusCard/statusCardStyles";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActions } from "../../hooks/query/peach069/useMobilePendingActions";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import i18n from "../../utils/i18n";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";

type ActionType =
  | "paymentConfirmed"
  | "paymentMade"
  | "refund"
  | "fundEscrow"
  | "fundMultipleEscrow"
  | "fundEscrowContract"
  | "refundEscrowContract";

type PendingAction =
  | MobilePendingActionContract
  | MobilePendingActionRefund
  | MobilePendingActionFundEscrow
  | MobilePendingActionFundMultipleEscrow;

type FlatPendingAction = {
  item: PendingAction;
  type: ActionType;
};

export const MobilePendingActions = () => {
  const { mobilePendingActions, isLoading, refetch } =
    useMobilePendingActions();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) return <></>;

  const flatActions: FlatPendingAction[] = mobilePendingActions
    ? [
        ...mobilePendingActions.paymentConfirmedPendingActions.map((item) => ({
          item,
          type: "paymentConfirmed" as const,
        })),
        ...mobilePendingActions.paymentMadePendingActions.map((item) => ({
          item,
          type: "paymentMade" as const,
        })),
        ...mobilePendingActions.refundPendingActions.map((item) => ({
          item,
          type: "refund" as const,
        })),
        ...(mobilePendingActions.fundEscrowPendingActions ?? []).map(
          (item) => ({ item, type: "fundEscrow" as const }),
        ),
        ...(mobilePendingActions.fundMultipleEscrowPendingActions ?? []).map(
          (item) => ({ item, type: "fundMultipleEscrow" as const }),
        ),
        ...(mobilePendingActions.fundEscrowContractPendingActions ?? []).map(
          (item) => ({ item, type: "fundEscrowContract" as const }),
        ),
        ...(mobilePendingActions.refundEscrowContractPendingActions ?? []).map(
          (item) => ({ item, type: "refundEscrowContract" as const }),
        ),
      ]
        .filter(({ item }) => item.status === "pending")
        .sort(
          (a, b) =>
            new Date(a.item.creationDate).getTime() -
            new Date(b.item.creationDate).getTime(),
        )
    : [];

  return (
    <Screen
      header={<Header title={i18n("connectToDesktop.mobilePendingActions")} />}
    >
      <View style={tw`grow`}>
        {flatActions.length > 0 ? (
          <FlatList
            contentContainerStyle={[
              tw`bg-transparent py-7 px-4`,
              isLoading && tw`opacity-60`,
            ]}
            data={flatActions}
            keyExtractor={({ item, type }) => `${type}-${item.id}`}
            renderItem={({ item }) => (
              <MobilePendingActionItem item={item.item} type={item.type} />
            )}
            ItemSeparatorComponent={() => <View style={tw`h-3`} />}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={false}
          />
        ) : (
          <MobilePendingActionsPlaceholder />
        )}
      </View>
    </Screen>
  );
};

const MobilePendingActionItem = ({
  item,
  type,
}: {
  item: PendingAction;
  type: ActionType;
}) => {
  const navigation = useStackNavigation();
  const { isDarkMode } = useThemeStore();

  const navigateToSpecificPage = () => {
    if (type === "paymentConfirmed")
      navigation.navigate("mobilePendingActionSignMultisig", {
        id: String(item.id),
      });
    else if (type === "paymentMade")
      navigation.navigate("mobilePendingActionRevealAddress", {
        id: String(item.id),
      });
    else if (type === "refund") {
      navigation.navigate("mobilePendingActionRefund", {
        id: String(item.id),
      });
    } else if (type === "fundEscrow") {
      navigation.navigate("mobilePendingActionFundEscrow", {
        id: String(item.id),
      });
    } else if (type === "fundMultipleEscrow") {
      navigation.navigate("mobilePendingActionFundMultipleEscrow", {
        id: String(item.id),
      });
    } else if (type === "fundEscrowContract") {
      navigation.navigate("mobilePendingActionFundContractEscrow", {
        contractId: String(item.id),
      });
    } else if (type === "refundEscrowContract") {
      navigation.navigate("mobilePendingActionRefundContractEscrow", {
        contractId: String(item.id),
      });
    }
  };

  const title =
    type === "fundMultipleEscrow"
      ? `Number of Offers: ${
          (JSON.parse(item.payload) as { address: string; amount: number }[])
            .length
        }`
      : "contractId" in item && item.contractId
        ? contractIdToHex(item.contractId)
        : offerIdToHex(String((item as { offerId: number }).offerId));

  const typeLabel = i18n(`connectToDesktop.mobilePendingActions.${type}`);

  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-light-color`,
        tw.style(statusCardStyles.border.primary),
      ]}
      onPress={navigateToSpecificPage}
    >
      <View style={tw`items-center px-4 py-3`}>
        <PeachText
          style={tw.style(
            "subtitle-1",
            isDarkMode ? "text-primary-mild-2" : "text-black-100",
          )}
        >
          {title}
        </PeachText>
      </View>
      <View
        style={[
          tw`items-center justify-center px-4 py-6px`,
          statusCardStyles.bg.primary,
        ]}
      >
        <PeachText
          style={[tw`subtitle-1`, tw.style(statusCardStyles.text.primary)]}
        >
          {typeLabel}
        </PeachText>
      </View>
    </TouchableOpacity>
  );
};

const MobilePendingActionsPlaceholder = () => (
  <View style={tw`items-center justify-center flex-1`}>
    <PeachText style={tw`h6 text-black-50 text-center`}>
      {i18n("connectToDesktop.mobilePendingActions.empty")}
    </PeachText>
  </View>
);
