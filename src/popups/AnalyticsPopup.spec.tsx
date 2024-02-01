import { fireEvent, render } from "test-utils";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { AnalyticsPopup } from "./AnalyticsPopup";

describe("AnalyticsPopup", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("enables analytics", () => {
    const { getByText } = render(<AnalyticsPopup />);
    fireEvent.press(getByText("sure"));

    expect(useSettingsStore.getState().enableAnalytics).toEqual(true);
  });
  it("rejects analytics", () => {
    const { getByText } = render(<AnalyticsPopup />);
    fireEvent.press(getByText("no, thanks"));

    expect(useSettingsStore.getState().enableAnalytics).toEqual(false);
  });
});
