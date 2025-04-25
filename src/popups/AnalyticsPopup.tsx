import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { PeachText } from "../components/text/PeachText";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { getLocalizedLink } from "../utils/web/getLocalizedLink";
import { openURL } from "../utils/web/openURL";

export function AnalyticsPopup() {
  const closePopup = useClosePopup();
  const setEnableAnalytics = useSettingsStore(
    (state) => state.setEnableAnalytics,
    shallow,
  );

  const accept = useCallback(async () => {
    await setEnableAnalytics(true);
    closePopup();
  }, [setEnableAnalytics, closePopup]);

  const deny = useCallback(async () => {
    await setEnableAnalytics(false);
    closePopup();
  }, [setEnableAnalytics, closePopup]);

  return (
    <PopupComponent
      title={i18n("analytics.request.title")}
      content={<AnalyticsPrompt />}
      actions={
        <>
          <PopupAction
            label={i18n("analytics.request.no")}
            iconId="xSquare"
            onPress={deny}
          />
          <PopupAction
            label={i18n("analytics.request.yes")}
            iconId="checkSquare"
            onPress={accept}
            reverseOrder
          />
        </>
      }
    />
  );
}

function AnalyticsPrompt() {
  const locale = useSettingsStore((state) => state.locale);
  return (
    <PeachText style={tw`text-black-100`}>
      {i18n("analytics.request.description1")}
      {"\n\n"}
      {i18n("analytics.request.description2")}
      <PeachText
        style={tw`mt-2 text-center underline text-black-100`}
        onPress={() => openURL(getLocalizedLink("privacy-policy", locale))}
      >
        {i18n("privacyPolicy").toLocaleLowerCase()}.
      </PeachText>
      {"\n\n"}
      {i18n("analytics.request.description3")}
    </PeachText>
  );
}
