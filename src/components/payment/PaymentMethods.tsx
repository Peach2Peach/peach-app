import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigationState } from "@react-navigation/native";
import { shallow } from "zustand/shallow";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { InfoPopup } from "../../popups/InfoPopup";
import { useOfferPreferences } from "../../store/offerPreferences";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getSelectedPaymentDataIds } from "../../utils/account/getSelectedPaymentDataIds";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { Header } from "../Header";
import { PeachScrollView } from "../PeachScrollView";
import { Screen } from "../Screen";
import { useSetPopup } from "../popup/GlobalPopup";
import { PeachText } from "../text/PeachText";
import { HorizontalLine } from "../ui/HorizontalLine";
import { AddPaymentMethodButton } from "./AddPaymentMethodButton";
import { MeetupPaymentMethods } from "./MeetupPaymentMethods";
import { RemotePaymentMethods } from "./RemotePaymentMethods";
import { useTranslate } from "@tolgee/react";

const PaymentMethodsTab = createMaterialTopTabNavigator();
const tabs = ["online", "meetups"] as const;

export const PaymentMethods = () => {
  const { t } = useTranslate("paymentMethod");
  const navigation = useStackNavigation();
  const [preferredPaymentMethods, select] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.selectPaymentMethod],
    shallow,
  );
  const selectedPaymentDataIds = getSelectedPaymentDataIds(
    preferredPaymentMethods,
  );

  const editItem = (data: PaymentData) => {
    if (isCashTrade(data.type)) {
      navigation.navigate("meetupScreen", {
        eventId: data.id.replace("cash.", ""),
        deletable: true,
        origin: "paymentMethods",
      });
    } else {
      navigation.navigate("paymentMethodForm", {
        paymentData: data,
        origin: "paymentMethods",
      });
    }
  };

  const isSelected = (itm: { value: string }) =>
    selectedPaymentDataIds.includes(itm.value);
  const { name: origin, params } = useNavigationState(
    (state) => state.routes[state.index - 1],
  );
  const isComingFromSettings =
    origin === "homeScreen" &&
    params &&
    "screen" in params &&
    params?.screen === "settings";
  const [isEditing, toggleIsEditing] = useToggleBoolean(isComingFromSettings);

  return (
    <Screen
      style={tw`px-0`}
      header={
        <PaymentMethodsHeader
          isEditing={isEditing}
          toggleIsEditing={toggleIsEditing}
        />
      }
    >
      <PaymentMethodsTab.Navigator
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        {tabs.map((tab) => (
          <PaymentMethodsTab.Screen
            key={tab}
            name={tab}
            options={{ title: `${t(`paymentSection.${tab}`)}` }}
          >
            {() => (
              <PeachScrollView
                style={tw`h-full mb-4`}
                contentContainerStyle={[
                  tw`justify-center pb-10 grow`,
                  tw`md:pb-16`,
                ]}
              >
                {tab === "online" ? (
                  <RemotePaymentMethods
                    {...{ isEditing, editItem, select, isSelected }}
                  />
                ) : (
                  <MeetupPaymentMethods
                    {...{ isEditing, editItem, select, isSelected }}
                  />
                )}
                <HorizontalLine style={tw`m-5`} />
                <AddPaymentMethodButton isCash={tab === "meetups"} />
              </PeachScrollView>
            )}
          </PaymentMethodsTab.Screen>
        ))}
      </PaymentMethodsTab.Navigator>
    </Screen>
  );
};

type Props = {
  isEditing: boolean;
  toggleIsEditing: () => void;
};

function PaymentMethodsHeader({ isEditing, toggleIsEditing }: Props) {
  const { t } = useTranslate("paymentMethod");
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<PaymentMethodsPopup />);
  const hasPaymentMethods = usePaymentDataStore(
    (state) => state.getPaymentDataArray().length !== 0,
  );

  return (
    <Header
      title={t(
        isEditing ? "paymentMethods.edit.title" : "paymentMethods.title",
      )}
      icons={
        hasPaymentMethods
          ? [
              {
                ...headerIcons[isEditing ? "checkbox" : "edit"],
                onPress: toggleIsEditing,
              },
              { ...headerIcons.help, onPress: showHelp },
            ]
          : [{ ...headerIcons.help, onPress: showHelp }]
      }
    />
  );
}

function PaymentMethodsPopup() {
  const { t } = useTranslate("help");
  return (
    <InfoPopup
      title={t("settings.paymentMethods", { ns: "paymentMethod" })}
      content={
        <>
          <PeachText>{t("help.paymentMethods.description.1")}</PeachText>
          <PeachText>{t("help.paymentMethods.description.2")}</PeachText>
        </>
      }
    />
  );
}
