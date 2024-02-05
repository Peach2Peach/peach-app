import { WebView } from "react-native-webview";
import ShallowRenderer from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import { Popup } from "../../components/popup/Popup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import {
  VerifyYouAreAHuman,
  VerifyYouAreAHumanPopup,
} from "./VerifyYouAreAHumanPopup";

const renderer = ShallowRenderer.createRenderer();

const mockInitApp = jest.fn();

jest.mock("../../init/useInitApp", () => ({
  useInitApp: () => mockInitApp,
}));
jest.useFakeTimers();

describe("VerifyYouAreAHumanPopup", () => {
  it("renders correctly", () => {
    renderer.render(<VerifyYouAreAHumanPopup />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("shows challenge popup", () => {
    const { getByText, UNSAFE_queryByType } = render(
      <>
        <VerifyYouAreAHumanPopup />
        <Popup />
      </>,
    );

    fireEvent.press(getByText("verify"));

    expect(UNSAFE_queryByType(VerifyYouAreAHuman)).toBeTruthy();
  });
});
describe("VerifyYouAreAHuman", () => {
  it("renders correctly", () => {
    renderer.render(<VerifyYouAreAHuman />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
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
