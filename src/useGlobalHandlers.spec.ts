import { renderHook } from "test-utils";
import { useGlobalHandlers } from "./useGlobalHandlers";

jest.mock("./hooks/query/useMarketPrices", () => ({
  useMarketPrices: jest.fn().mockReturnValue({
    data: { EUR: 20000, CHF: 20000 },
  }),
}));
jest.mock("./hooks/useShouldShowBackupReminder");
const useShouldShowBackupReminderMock = jest.requireMock(
  "./hooks/useShouldShowBackupReminder",
).useShouldShowBackupReminder;
jest.mock("./init/useInitialNavigation");
const useInitialNavigationMock = jest.requireMock(
  "./init/useInitialNavigation",
).useInitialNavigation;
jest.mock("./hooks/useShowUpdateAvailable");
const useShowUpdateAvailableMock = jest.requireMock(
  "./hooks/useShowUpdateAvailable",
).useShowUpdateAvailable;
jest.mock("./hooks/useDynamicLinks");
const useDynamicLinksMock = jest.requireMock(
  "./hooks/useDynamicLinks",
).useDynamicLinks;
jest.mock("./hooks/useCheckFundingMultipleEscrows");
const useCheckFundingMultipleEscrowsMock = jest.requireMock(
  "./hooks/useCheckFundingMultipleEscrows",
).useCheckFundingMultipleEscrows;
jest.mock("./hooks/notifications/useHandleNotifications");
const useHandleNotificationsMock = jest.requireMock(
  "./hooks/notifications/useHandleNotifications",
).useHandleNotifications;
jest.mock("react-native-promise-rejection-utils", () => ({
  setUnhandledPromiseRejectionTracker: jest.fn(),
}));

describe("useGlobalHandlers", () => {
  it("should call useShouldShowBackupReminder", () => {
    renderHook(useGlobalHandlers);
    expect(useShouldShowBackupReminderMock).toHaveBeenCalled();
  });
  it("should call useInitialNavigation", () => {
    renderHook(useGlobalHandlers);
    expect(useInitialNavigationMock).toHaveBeenCalled();
  });
  it("should call useShowUpdateAvailable", () => {
    renderHook(useGlobalHandlers);
    expect(useShowUpdateAvailableMock).toHaveBeenCalled();
  });
  it("should call useDynamicLinks", () => {
    renderHook(useGlobalHandlers);
    expect(useDynamicLinksMock).toHaveBeenCalled();
  });
  it("should call useCheckFundingMultipleEscrows", () => {
    renderHook(useGlobalHandlers);
    expect(useCheckFundingMultipleEscrowsMock).toHaveBeenCalled();
  });
  it("should call useHandleNotifications", () => {
    renderHook(useGlobalHandlers);
    expect(useHandleNotificationsMock).toHaveBeenCalled();
  });
});
