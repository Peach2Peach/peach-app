import { NETWORK } from "@env";
import { useSyncExternalStore } from "react";
import de from "../../i18n/de";
import elGR from "../../i18n/el-GR";
import en from "../../i18n/en";
import es from "../../i18n/es";
import fr from "../../i18n/fr";
import hu from "../../i18n/hu";
import it from "../../i18n/it";
import nl from "../../i18n/nl";
import pl from "../../i18n/pl";
import pt from "../../i18n/pt";
import ptBR from "../../i18n/pt-BR";
import ru from "../../i18n/ru";
import sw from "../../i18n/sw";
import tr from "../../i18n/tr";
import uk from "../../i18n/uk";
import { keys } from "../object/keys";
import { getLocaleLanguage } from "./getLocaleLanguage";

const localeMapping: Record<string, Record<string, string>> = {
  de,
  "el-GR": elGR,
  en,
  es,
  fr,
  hu,
  it,
  nl,
  "pt-BR": ptBR,
  pt,
  sw,
  tr,
};

type LanguageState = {
  locale: string;
};
export const languageState: LanguageState = {
  locale: "en",
};
if (NETWORK !== "bitcoin") {
  localeMapping.pl = pl;
  localeMapping.ru = ru;
  localeMapping.uk = uk;
  localeMapping.raw = {};
}
const locales = keys(localeMapping);

//for sync

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => languageState.locale;

export const useI18n = () => useSyncExternalStore(subscribe, getSnapshot);

// end of sync code

const i18n = (id: string, ...args: string[]) => {
  const locale = languageState.locale.replace("_", "-");
  if (locale === "raw") return id;
  let text = localeMapping[locale]?.[id];

  if (!text && locale.includes("-")) {
    const language = getLocaleLanguage(locale);
    text = localeMapping[language]?.[id];
  }
  if (!text) text = localeMapping.en[id];

  if (!text) return id;

  args.forEach((arg, index) => {
    const regex = new RegExp(`\\$${index}`, "ug");
    text = text.replace(regex, arg);
  });

  const SPACE_THRESHOLD = 4;
  return (text.match(/ /gu) || []).length >= SPACE_THRESHOLD
    ? text.replace(/ (?=[^ ]*$)/u, " ")
    : text;
};

i18n.break = (id: string, ...args: string[]) =>
  i18n(id, ...args).replace(/ /gu, " ");

i18n.getLocales = () => locales;

i18n.setLocale = (newLocale: string) => {
  if (!localeMapping[newLocale]) newLocale = "en";

  if (languageState.locale !== newLocale) {
    languageState.locale = newLocale;
    listeners.forEach((l) => l());
  }
};

export default i18n;
