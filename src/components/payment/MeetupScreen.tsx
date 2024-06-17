import { API_URL } from "@env";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";
import { Image, View } from "react-native";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { useRoute } from "../../hooks/useRoute";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { Header } from "../Header";
import { PeachScrollView } from "../PeachScrollView";
import { Screen } from "../Screen";
import { Button } from "../buttons/Button";
import { CurrencySelection } from "../inputs/paymentForms/components";
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
  const { t } = useTranslate();

  return (
    <Screen header={<MeetupScreenHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        {!!event.logo && (
          <Image
            source={{ uri: API_URL + event.logo }}
            style={tw`w-full mb-5 h-30`}
            resizeMode={"contain"}
          />
        )}
        <View style={tw`gap-8`}>
          <PeachText style={tw`body-l text-black-100`}>
            {t("meetup.description", { meetup: event.longName })}
          </PeachText>
          {!!event.frequency && (
            <View style={tw`gap-4`}>
              <PeachText style={tw`body-l`}>
                {`${t("meetup.date")}: `}
                <PeachText style={tw`h6`}>{event.frequency}</PeachText>
              </PeachText>
              {!!event.address && (
                <PeachText style={tw`body-l text-black-100`}>
                  {event.address}
                </PeachText>
              )}
            </View>
          )}
          <View style={tw`gap-4`}>
            {!!event.address && (
              <Link
                text={t("view.maps")}
                url={`http://maps.google.com/maps?daddr=${event.address}`}
              />
            )}
            {!!event.url && <Link text={t("meetup.website")} url={event.url} />}
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
          {t("meetup.add")}
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
  const { t } = useTranslate();
  return (
    <InfoPopup
      title={t("tradingCash")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>{t("tradingCash.text")}</PeachText>
          <View>
            <BulletPoint text={t("tradingCash.point.1")} />
            <BulletPoint text={t("tradingCash.point.2")} />
            <BulletPoint text={t("tradingCash.point.3")} />
            <BulletPoint text={t("tradingCash.point.4")} />
          </View>
        </View>
      }
    />
  );
}
