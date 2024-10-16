import { renderHook } from "test-utils";
import { useHandleNotifications } from "./hooks/notifications/useHandleNotifications";
import { useCheckFundingMultipleEscrows } from "./hooks/useCheckFundingMultipleEscrows";
import { useShouldShowBackupReminder } from "./hooks/useShouldShowBackupReminder";
import { useShowUpdateAvailable } from "./hooks/useShowUpdateAvailable";
import { useInitialNavigation } from "./init/useInitialNavigation";
import { useGlobalHandlers } from "./useGlobalHandlers";

jest.mock("./hooks/query/useMarketPrices", () => ({
  useMarketPrices: () => ({
    data: { EUR: 20000, CHF: 20000 },
  }),
}));

jest.mock("./hooks/useShouldShowBackupReminder");
jest.mock("./init/useInitialNavigation", () => ({
  useInitialNavigation: jest.fn(),
}));
jest.mock("./hooks/useShowUpdateAvailable", () => ({
  useShowUpdateAvailable: jest.fn(),
}));
jest.mock("./hooks/useCheckFundingMultipleEscrows", () => ({
  useCheckFundingMultipleEscrows: jest.fn(),
}));
jest.mock("./hooks/notifications/useHandleNotifications");
jest.mock("react-native-promise-rejection-utils", () => ({
  setUnhandledPromiseRejectionTracker: jest.fn(),
}));
jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: () => ({
    onTokenRefresh: () => jest.fn(),
  }),
}));

jest.useFakeTimers();

describe("useGlobalHandlers", () => {
  it("should call useShouldShowBackupReminder", () => {
    renderHook(useGlobalHandlers);
    expect(useShouldShowBackupReminder).toHaveBeenCalled();
  });
  it("should call useInitialNavigation", () => {
    renderHook(useGlobalHandlers);
    expect(useInitialNavigation).toHaveBeenCalled();
  });
  it("should call useShowUpdateAvailable", () => {
    renderHook(useGlobalHandlers);
    expect(useShowUpdateAvailable).toHaveBeenCalled();
  });
  it("should call useCheckFundingMultipleEscrows", () => {
    renderHook(useGlobalHandlers);
    expect(useCheckFundingMultipleEscrows).toHaveBeenCalled();
  });
  it("should call useHandleNotifications", () => {
    renderHook(useGlobalHandlers);
    expect(useHandleNotifications).toHaveBeenCalled();
  });
});
