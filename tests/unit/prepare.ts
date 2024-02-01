import { mockBDKRN } from "./mocks/bdkRN";

const CookieManagerMock = jest.fn();
jest.mock("@react-native-cookies/cookies", () => ({
  set: (...args: unknown[]) => CookieManagerMock(...args),
}));

const WebViewMock = jest.fn();
jest.mock("react-native-webview", () => ({
  WebView: (...args: unknown[]) => WebViewMock(...args),
}));

jest.mock("../../src/utils/peachAPI", () => ({
  peachAPI: jest.requireActual("../../src/utils/peachAPI/peachAPI").peachAPI,
}));
jest.mock("../../peach-api/src/peachAPI");
jest.mock("../../src/utils/wallet/PeachWallet");
jest.mock("../../src/utils/log/error");
jest.mock("../../src/utils/log/info");
jest.mock("../../src/utils/log/log");

jest.mock("../../src/utils/system/getDeviceLocale", () => ({
  getDeviceLocale: () => "en",
}));

jest.mock("react-native-safe-area-context", () => ({
  ...jest.requireActual("react-native-safe-area-context"),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

mockBDKRN();
export {};
