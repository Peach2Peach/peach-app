import { API_URL } from "@env";
import { useCallback, useMemo } from "react";
import { Image, View } from "react-native";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { useRoute } from "../../hooks/useRoute";
import { InfoPopup } from "../../popups/InfoPopup";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { Header } from "../Header";
import { PeachScrollView } from "../PeachScrollView";
import { Screen } from "../Screen";
import { Button } from "../buttons/Button";
import { CurrencySelection } from "../inputs/paymentForms/CurrencySelection";
import { useSetPopup } from "../popup/GlobalPopup";
import { BulletPoint } from "../text/BulletPoint";
import { PeachText } from "../text/PeachText";
import { DeletePaymentMethodPopup } from "./components/DeletePaymentMethodPopup";
import { Link } from "./components/Link";
import { useMeetupScreenSetup } from "./hooks/useMeetupScreenSetup";

export const MeetupScreen = () => {
  const {
    paymentMethod,
    event,
    deletable,
    addToPaymentMethods,
    selectedCurrencies,
    onCurrencyToggle,
  } = useMeetupScreenSetup();
  const { isDarkMode } = useThemeStore();

  return (
    <Screen header={<MeetupScreenHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-5`}
      >
        {!!event.logo && (
          <Image
            source={{ uri: API_URL + event.logo }}
            style={tw`w-full h-30`}
            resizeMode={"contain"}
          />
        )}
        <View style={tw`gap-8`}>
          <PeachText style={tw`body-l`}>
            {i18n("meetup.description", event.longName)}
          </PeachText>
          {!!event.frequency && (
            <View style={tw`gap-4`}>
              <PeachText style={tw`body-l`}>
                {`${i18n("meetup.date")}: `}
                <PeachText style={tw`h6 text-primary-main`}>
                  {event.frequency}
                </PeachText>
              </PeachText>
              {!!event.address && (
                <PeachText
                  style={tw`body-l ${
                    isDarkMode ? "text-primary-mild-1" : "text-black-100"
                  }`}
                >
                  {event.address}
                </PeachText>
              )}
            </View>
          )}
          <View style={tw`gap-4`}>
            {!!event.address && (
              <Link
                text={i18n("view.maps")}
                url={`http://maps.google.com/maps?daddr=${event.address}`}
              />
            )}
            {!!event.url && (
              <Link text={i18n("meetup.website")} url={event.url} />
            )}
          </View>
          {event.currencies.length > 1 && (
            <CurrencySelection
              onToggle={onCurrencyToggle}
              {...{ paymentMethod, selectedCurrencies }}
            />
          )}
        </View>
      </PeachScrollView>
      {(!deletable || event.currencies.length > 1) && (
        <Button style={tw`self-center`} onPress={addToPaymentMethods}>
          {i18n("meetup.add")}
        </Button>
      )}
    </Screen>
  );
};

function MeetupScreenHeader() {
  const route = useRoute<"meetupScreen">();
  const { eventId } = route.params;
  const deletable = route.params.deletable ?? false;
  const setPopup = useSetPopup();
  const showHelp = useCallback(() => setPopup(<CashTradesPopup />), [setPopup]);
  const deletePaymentMethod = useCallback(
    () => setPopup(<DeletePaymentMethodPopup id={`cash.${eventId}`} />),
    [eventId, setPopup],
  );
  const { data: meetupEvents } = useMeetupEvents();
  const title =
    meetupEvents?.find(({ id }) => id === eventId)?.shortName || eventId;

  const memoizedIcons = useMemo(() => {
    const icons = [{ ...headerIcons.help, onPress: showHelp }];
    if (deletable) {
      return [
        ...icons,
        { ...headerIcons.delete, onPress: deletePaymentMethod },
      ];
    }
    return icons;
  }, [deletable, deletePaymentMethod, showHelp]);

  return <Header title={title} icons={memoizedIcons} />;
}

function CashTradesPopup() {
  const bulletPoints = [];
  const start = 1;
  const numerOfBulletPoints = 4;
  for (let i = start; i < start + numerOfBulletPoints; i++) {
    bulletPoints.push(
      <BulletPoint key={i} text={i18n(`tradingCash.point.${i}`)} />,
    );
  }

  return (
    <InfoPopup
      title={i18n("tradingCash")}
      content={
        <View style={tw`gap-3`}>
          <PeachText style={tw`text-black-100`}>
            {i18n("tradingCash.text")}
          </PeachText>
          <View>{bulletPoints}</View>
        </View>
      }
    />
  );
}
