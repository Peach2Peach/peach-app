import { isDefined } from "../utils/validation/isDefined";
import de from "./de";
import elGR from "./el-GR";
import en from "./en";
import es from "./es";
import fr from "./fr";
import it from "./it";
import sw from "./sw";
import tr from "./tr";

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
});
