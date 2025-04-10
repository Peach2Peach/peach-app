import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../i18n";
import { getMessages } from "./getMessages";

describe("getMessages", () => {
  it("has all messages defined", () => {
    const messages = getMessages();
    for (const message in messages) {
      expect(message).toBeDefined();
    }
  });
  it("returns messages in the right language", () => {
    useSettingsStore.setState({ locale: "en" });
    expect(getMessages().required).toEqual(i18n("form.required.error"));
    useSettingsStore.setState({ locale: "de" });
    expect(getMessages().required).toEqual(i18n("form.required.error"));
  });
});
