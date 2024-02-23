import { languageState } from "../i18n";
import { getMessages } from "./getMessages";
import { tolgee } from "../../tolgee";
describe("getMessages", () => {
  it("has all messages defined", () => {
    const messages = getMessages();
    for (const message in messages) {
      expect(message).toBeDefined();
    }
  });
  it("returns messages in the right language", () => {
    languageState.locale = "en";
    expect(getMessages().required).toEqual(
      tolgee.t("form.required.error", { ns: "form" }),
    );
    languageState.locale = "de";
    expect(getMessages().required).toEqual(
      tolgee.t("form.required.error", { ns: "form" }),
    );
  });
});
