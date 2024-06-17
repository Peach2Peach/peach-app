import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import i18n from "../utils/i18n";
import { useTolgee } from "@tolgee/react";

export const useLanguage = () => {
  const [locale, setLocaleStore] = useSettingsStore(
    (state) => [state.locale, state.setLocale],
    shallow,
  );
  const tolgee = useTolgee(["language"]);

  const updateLocale = useCallback(
    (l: string) => {
      tolgee.changeLanguage(l);
      i18n.setLocale(l);
      setLocaleStore(l);
    },
    [setLocaleStore, tolgee],
  );

  return { locale: locale || "en", updateLocale };
};
