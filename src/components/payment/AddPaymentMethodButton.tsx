import { TouchableOpacity } from "react-native";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { sortAlphabetically } from "../../utils/array/sortAlphabetically";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { useDrawerState } from "../drawer/useDrawerState";
import { PeachText } from "../text/PeachText";
import { getCountrySelectDrawerOptions } from "./helpers/getCountrySelectDrawerOptions";
import { mapEventToDrawerOption } from "./helpers/mapEventToDrawerOption";

type Props = ComponentProps & {
  isCash: boolean;
};

export const AddPaymentMethodButton = ({ isCash, style }: Props) => {
  const navigation = useStackNavigation();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);
  const { data: meetupEvents, isLoading } = useMeetupEvents();
  const addPaymentMethods = () => {
    navigation.navigate("selectCurrency", { origin: "paymentMethods" });
  };

  const goToEventDetails = (eventID: MeetupEvent["id"]) => {
    updateDrawer({ show: false });
    navigation.push("meetupScreen", {
      eventId: eventID.replace("cash.", ""),
      origin: "paymentMethods",
    });
  };

  const selectCountry = (
    eventsByCountry: CountryEventsMap,
    selected: Country,
  ) => {
    if (!meetupEvents) return;

    updateDrawer({
      title: i18n("meetup.select"),
      options: eventsByCountry[selected]
        .sort((a, b) => sortAlphabetically(a.city, b.city))
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .map(mapEventToDrawerOption(goToEventDetails)),
      previousDrawer: getCountrySelectDrawerOptions(
        meetupEvents,
        goToEventDetails,
        selectCountry,
      ),
      show: true,
    });
  };

  const addCashPaymentMethods = () => {
    if (!meetupEvents) return;
    updateDrawer(
      getCountrySelectDrawerOptions(
        meetupEvents,
        goToEventDetails,
        selectCountry,
      ),
    );
  };

  return (
    <TouchableOpacity
      onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
      disabled={isCash && isLoading}
      style={[
        tw`flex-row items-center self-center justify-center w-full gap-3`,
        style,
        isCash && isLoading && tw`opacity-50`,
      ]}
    >
      <Icon
        id="plusCircle"
        style={tw`w-7 h-7`}
        color={tw.color("primary-main")}
      />
      <PeachText style={tw`h6 text-primary-main shrink`}>
        {i18n.break(
          `paymentMethod.select.button.${isCash ? "cash" : "remote"}`,
        )}
      </PeachText>
    </TouchableOpacity>
  );
};
