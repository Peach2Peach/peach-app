import { DevTools, FormatSimple, Tolgee } from "@tolgee/react";
import de from "./i18n/de";
import el from "./i18n/el-GR";
import en from "./i18n/en";
import es from "./i18n/es";
import fr from "./i18n/fr";
import hu from "./i18n/hu";
import it from "./i18n/it";
import nl from "./i18n/nl";
import pl from "./i18n/pl";
import pt from "./i18n/pt";
import ptBR from "./i18n/pt-BR";
import ru from "./i18n/ru";
import sw from "./i18n/sw";
import tr from "./i18n/tr";
import uk from "./i18n/uk";

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: "en",

    apiUrl: process.env.TOLGEE_API_URL,
    apiKey: process.env.TOLGEE_API_KEY,

    ns: [
      "accessibility",
      "analytics",
      "batching",
      "buy",
      "chat",
      "contract",
      "error",
      "form",
      "global",
      "help",
      "home",
      "match",
      "notification",
      "offer",
      "offerPreferences",
      "paymentMethod",
      "profile",
      "referral",
      "sell",
      "settings",
      "test",
      "unassigned",
      "wallet",
      "welcome",
    ],

    // for production
    staticData: {
      de,
      "el-GR": el,
      en,
      es,
      fr,
      hu,
      it,
      nl,
      pl,
      "pt-BR": ptBR,
      pt,
      ru,
      sw,
      tr,
      uk,
    },
  });

tolgee.run();
