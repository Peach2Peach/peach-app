import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";
import {
  MobilePendingActionContract,
  MobilePendingActionFundEscrow,
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

type SectionType = "paymentConfirmed" | "paymentMade" | "refund" | "fundEscrow";

type PendingActionSection = {
  title: string;
  type: SectionType;
  data: PendingAction[];
};

type PendingAction =
  | MobilePendingActionContract
  | MobilePendingActionRefund
  | MobilePendingActionFundEscrow;

export const MobilePendingActions = () => {
  const { mobilePendingActions, isLoading, refetch } =
    useMobilePendingActions();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) return <></>;

  const sections: PendingActionSection[] = mobilePendingActions
    ? [
        {
          title: i18n("connectToDesktop.mobilePendingActions.paymentConfirmed"),
          data: mobilePendingActions.paymentConfirmedPendingActions.filter(
            (x) => x.status === "pending",
          ),
          type: "paymentConfirmed",
        },
        {
          title: i18n("connectToDesktop.mobilePendingActions.paymentMade"),
          data: mobilePendingActions.paymentMadePendingActions.filter(
            (x) => x.status === "pending",
          ),
          type: "paymentMade",
        },
        {
          title: i18n("connectToDesktop.mobilePendingActions.refund"),
          data: mobilePendingActions.refundPendingActions.filter(
            (x) => x.status === "pending",
          ),
          type: "refund",
        },
        {
          title: i18n("connectToDesktop.mobilePendingActions.fundEscrow"),
          data: (mobilePendingActions.fundEscrowPendingActions ?? []).filter(
            (x) => x.status === "pending",
          ),
          type: "fundEscrow",
        },
      ].filter((section) => section.data.length > 0)
    : [];

  return (
    <Screen
      header={<Header title={i18n("connectToDesktop.mobilePendingActions")} />}
    >
      <View style={tw`grow`}>
        {sections.length > 0 ? (
          <SectionList
            contentContainerStyle={[
              tw`bg-transparent py-7`,
              isLoading && tw`opacity-60`,
            ]}
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item, section }) => (
              <MobilePendingActionItem item={item} type={section.type} />
            )}
            renderSectionHeader={({ section }) => (
              <PeachText style={tw`px-4 pb-2 font-bold`}>
                {section.title}
              </PeachText>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            SectionSeparatorComponent={() => (
              <View style={tw`h-px bg-gray-300 my-6`} />
            )}
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
  type: SectionType;
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
      console.log("item.id", item.id);
      navigation.navigate("mobilePendingActionRefund", {
        id: String(item.id),
      });
    } else if (type === "fundEscrow") {
      navigation.navigate("mobilePendingActionFundEscrow", {
        id: String(item.id),
      });
    }
  };

  const description =
    "contractId" in item && item.contractId
      ? "Contract: " + contractIdToHex(item.contractId)
      : "Offer: " + offerIdToHex((item as { offerId: number }).offerId);

  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-light-color`,
        tw.style(statusCardStyles.border["primary"]),
      ]}
      onPress={navigateToSpecificPage}
    >
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <PeachText style={tw`text-center mt-1`}>
          <PeachText
            style={tw.style(
              isDarkMode ? "text-primary-mild-2" : "text-black-100",
            )}
          >
            {description}
          </PeachText>
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
