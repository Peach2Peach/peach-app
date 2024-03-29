import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import i18n from "../utils/i18n";

export const useLanguage = () => {
  const [locale, setLocaleStore] = useSettingsStore(
    (state) => [state.locale, state.setLocale],
    shallow,
  );

  const updateLocale = useCallback(
    (l: string) => {
      i18n.setLocale(l);
      setLocaleStore(l);
    },
    [setLocaleStore],
  );

  return { locale: locale || "en", updateLocale };
};
