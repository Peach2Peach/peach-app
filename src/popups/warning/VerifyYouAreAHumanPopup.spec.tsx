import { WebView } from "react-native-webview";
import { fireEvent, render } from "test-utils";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import {
  VerifyYouAreAHuman,
  VerifyYouAreAHumanPopup,
} from "./VerifyYouAreAHumanPopup";

const mockInitApp = jest.fn();

jest.mock("../../init/useInitApp", () => ({
  useInitApp: () => mockInitApp,
}));
jest.useFakeTimers();

describe("VerifyYouAreAHumanPopup", () => {
  it("shows challenge popup", () => {
    const { getByText, UNSAFE_queryByType } = render(
      <>
        <VerifyYouAreAHumanPopup />
        <GlobalPopup />
      </>,
    );

    fireEvent.press(getByText("verify"));

    expect(UNSAFE_queryByType(VerifyYouAreAHuman)).toBeTruthy();
  });
});
describe("VerifyYouAreAHuman", () => {
  it("sets cloudflare challenge from webview", () => {
    const cloudflareChallenge = {
      cfClearance: "cfClearance",
      userAgent: "userAgent",
    };
    const { UNSAFE_getByType } = render(<VerifyYouAreAHuman />);
    fireEvent(UNSAFE_getByType(WebView), "onMessage", {
      nativeEvent: { data: JSON.stringify(cloudflareChallenge) },
    });
    expect(useSettingsStore.getState().cloudflareChallenge).toEqual(
      cloudflareChallenge,
    );
    expect(mockInitApp).toHaveBeenCalled();
  });
});
