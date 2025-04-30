import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useShallow } from "zustand/shallow";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { InfoPopup } from "../../popups/InfoPopup";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getSelectedPaymentDataIds } from "../../utils/account/getSelectedPaymentDataIds";
import i18n from "../../utils/i18n";
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

const PaymentMethodsTab = createMaterialTopTabNavigator();
const tabs = ["online", "meetups"] as const;

export const PaymentMethods = () => {
  const navigation = useStackNavigation();
  const [preferredPaymentMethods, select] = useOfferPreferences(
    useShallow((state) => [
      state.preferredPaymentMethods,
      state.selectPaymentMethod,
    ]),
  );
  const selectedPaymentDataIds = getSelectedPaymentDataIds(
    preferredPaymentMethods,
  );

  const editItem = (data: PaymentData) => {
    if (isCashTrade(data.type)) {
      navigation.navigateDeprecated("meetupScreen", {
        eventId: data.id.replace("cash.", ""),
        deletable: true,
        origin: "paymentMethods",
      });
    } else {
      navigation.navigateDeprecated("paymentMethodForm", {
        paymentData: data,
        origin: "paymentMethods",
      });
    }
  };

  const isSelected = (itm: { value: string }) =>
    selectedPaymentDataIds.includes(itm.value);

  const { routes } = useStackNavigation().getState();
  const { name: origin, params } = routes[routes.length - 2];
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
        screenOptions={{
          ...fullScreenTabNavigationScreenOptions,
          sceneStyle: [tw`px-sm`, tw`md:px-md`],
        }}
      >
        {tabs.map((tab) => (
          <PaymentMethodsTab.Screen
            key={tab}
            name={tab}
            options={{ title: `${i18n(`paymentSection.${tab}`)}` }}
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
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<PaymentMethodsPopup />);
  const hasPaymentMethods = usePaymentDataStore(
    useShallow((state) => Object.values(state.paymentData).length !== 0),
  );

  return (
    <Header
      title={i18n(
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
  return (
    <InfoPopup
      title={i18n("settings.paymentMethods")}
      content={
        <>
          <PeachText style={tw`text-black-100`}>
            {i18n("help.paymentMethods.description.1")}
          </PeachText>
          <PeachText style={tw`text-black-100`}>
            {i18n("help.paymentMethods.description.2")}
          </PeachText>
        </>
      }
    />
  );
}
