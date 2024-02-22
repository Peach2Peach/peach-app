import { act } from "react-test-renderer";
import { render, renderHook } from "test-utils";
import { Toast } from "../components/toast/Toast";
import { APPVERSION } from "../constants";
import { useConfigStore } from "../store/configStore/configStore";
import { useShowUpdateAvailable } from "./useShowUpdateAvailable";
import { tolgee } from "../tolgee";

jest.useFakeTimers();

describe("useShowUpdateAvailable", () => {
  const definitelyHigherVersion = "99.99.99";
  beforeEach(() => {
    useConfigStore.getState().setLatestAppVersion(APPVERSION);
    useConfigStore.getState().setMinAppVersion(APPVERSION);
  });
  it("does not show update available banner if app version is above min/latest", () => {
    const { queryByText } = render(<Toast />);
    renderHook(useShowUpdateAvailable);
    expect(queryByText(tolgee.t("UPDATE_AVAILABLE.text"))).toBeFalsy();
  });
  it("does show update available banner if app version is not above latest", () => {
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion);
    const { queryByText } = render(<Toast />);
    renderHook(useShowUpdateAvailable);

    expect(queryByText(tolgee.t("UPDATE_AVAILABLE.text"))).toBeTruthy();
  });
  it("does show critical update available banner if app version is not above min", () => {
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion);
    const { queryByText } = render(<Toast />);

    renderHook(useShowUpdateAvailable);

    expect(
      queryByText(tolgee.t("CRITICAL_UPDATE_AVAILABLE.text")),
    ).toBeTruthy();
  });
  it("does still show critical update available banner if app version is not above min/latest", () => {
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion);
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion);

    const { queryByText } = render(<Toast />);

    renderHook(useShowUpdateAvailable);

    expect(
      queryByText(tolgee.t("CRITICAL_UPDATE_AVAILABLE.text")),
    ).toBeTruthy();
  });
  it("shows update banner should the min/latest version change during the session", () => {
    const { queryByText } = render(<Toast />);
    renderHook(useShowUpdateAvailable);

    expect(queryByText(tolgee.t("UPDATE_AVAILABLE.text"))).toBeFalsy();

    act(() => {
      useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion);
    });

    expect(queryByText(tolgee.t("UPDATE_AVAILABLE.text"))).toBeTruthy();
  });
});
