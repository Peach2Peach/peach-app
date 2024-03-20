import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { PeachText } from "../components/text/PeachText";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import tw from "../styles/tailwind";
import { languageState } from "../utils/i18n";
import { getLocalizedLink } from "../utils/web/getLocalizedLink";
import { openURL } from "../utils/web/openURL";
import { useTranslate } from "@tolgee/react";

export function AnalyticsPopup() {
  const closePopup = useClosePopup();
  const setEnableAnalytics = useSettingsStore(
    (state) => state.setEnableAnalytics,
    shallow,
  );
  const { t } = useTranslate("analytics");

  const accept = useCallback(() => {
    setEnableAnalytics(true);
    closePopup();
  }, [setEnableAnalytics, closePopup]);

  const deny = useCallback(() => {
    setEnableAnalytics(false);
    closePopup();
  }, [setEnableAnalytics, closePopup]);

  return (
    <PopupComponent
      title={t("analytics.request.title")}
      content={<AnalyticsPrompt />}
      actions={
        <>
          <PopupAction
            label={t("analytics.request.no")}
            iconId="xSquare"
            onPress={deny}
          />
          <PopupAction
            label={t("analytics.request.yes")}
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
  const { t } = useTranslate("analytics");

  return (
    <PeachText>
      {t("analytics.request.description1")}
      {"\n\n"}
      {t("analytics.request.description2")}
      <PeachText
        style={tw`mt-2 text-center underline`}
        onPress={() =>
          openURL(getLocalizedLink("privacy-policy", languageState.locale))
        }
      >
        {t("privacyPolicy").toLocaleLowerCase()}.
      </PeachText>
      {"\n\n"}
      {t("analytics.request.description3")}
    </PeachText>
  );
}
