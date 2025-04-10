import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import i18n from "../utils/i18n";

export const useTranslation = () => {
  const locale = useSettingsStore((state) => state.locale) || "en";

  const t = (id: string, ...args: string[]) => i18n(id, ...args);

  return { t, locale };
};
