import { fireEvent, render, waitFor } from "test-utils";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { AnalyticsPopup } from "./AnalyticsPopup";

describe("AnalyticsPopup", () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("enables analytics", async () => {
    const { getByText } = render(<AnalyticsPopup />);
    fireEvent.press(getByText("sure"));

    await waitFor(() => {
      expect(useSettingsStore.getState().enableAnalytics).toEqual(true);
    });
  });
  it("rejects analytics", async () => {
    const { getByText } = render(<AnalyticsPopup />);
    fireEvent.press(getByText("no, thanks"));

    await waitFor(() => {
      expect(useSettingsStore.getState().enableAnalytics).toEqual(false);
    });
  });
});
