import { isDefined } from "../utils/validation/isDefined";
import de from "./de";
import elGR from "./el-GR";
import en from "./en";
import es from "./es";
import fr from "./fr";
import hu from "./hu";
import it from "./it";
import nl from "./nl";
import pl from "./pl";
import pt from "./pt";
import ptBR from "./pt-BR";
import ru from "./ru";
import sw from "./sw";
import tr from "./tr";
import uk from "./uk";

const locales = {
  de,
  "el-GR": elGR,
  en,
  es,
  fr,
  hu,
  it,
  nl,
  pl,
  pt,
  "pt-BR": ptBR,
  ru,
  sw,
  tr,
  uk,
};

describe("translations", () => {
  test("non existing texts has not been translated", () => {
    for (const key in es) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in fr) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in it) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in de) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in elGR) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in tr) {
      expect(isDefined(en[key])).toBe(true);
    }
    for (const key in sw) {
      expect(isDefined(en[key])).toBe(true);
    }
  });

  // the bold value is compiled into a RegExp and matched against its sibling
  // text in TradingConditionsUpdatePopup - it has to occur there verbatim
  test.each(Object.entries(locales))(
    "%s highlights an existing part of the trading conditions text",
    (_locale, translations) => {
      const text = translations["tradingConditionsUpdate.text"];
      const bold = translations["tradingConditionsUpdate.text.bold"];

      expect(bold).toBeTruthy();
      expect(text).toContain(bold);
      expect(() => new RegExp(bold, "u")).not.toThrow();
    },
  );
});
