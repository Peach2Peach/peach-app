import {
  EnvironmentType,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
} from "@breeztech/react-native-breez-sdk";
import { BREEZ_API_KEY } from "@env";
import { nodeInfo } from "../../../tests/unit/data/lightningNetworkData";
import { initLightningWallet } from "./initLightningWallet";

jest.mock("@breeztech/react-native-breez-sdk");
const seed = [1, 2, 2];
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .mnemonicToSeed.mockResolvedValue(seed);
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .connect.mockResolvedValue();

const config = {
  breezserver: "unittest",
};
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .defaultConfig.mockResolvedValue(config);
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

jest.mock("react-native-fs", () => ({
  __esModule: true,
  default: {
    readFileAssets: jest.fn((path) => {
      if (path.includes("certs/client-key.pem")) {
        return "deviceKey";
      }
      if (path.includes("certs/client.crt")) {
        return "deviceCert";
      }
      return "";
    }),
    readFile: jest.fn((path) => {
      if (path.includes("certs/client-key.pem")) {
        return "deviceKey";
      }
      if (path.includes("certs/client.crt")) {
        return "deviceCert";
      }
      return "";
    }),
  },
}));

const expectedConfig = {
  type: NodeConfigVariant.GREENLIGHT,
  config: {
    partnerCredentials: {
      deviceKey: Array.from(Buffer.from("deviceKey", "base64")),
      deviceCert: Array.from(Buffer.from("deviceCert", "base64")),
    },
  },
};

describe("initLightningWallet", () => {
  const mnemonic = "mom mom mom mom mom mom mom mom mom mom mom mom";
  it("should initialise breez sdk lightning wallet", async () => {
    await initLightningWallet(mnemonic, BREEZ_API_KEY);
    expect(mnemonicToSeed).toHaveBeenCalledWith(mnemonic);
    expect(defaultConfig).toHaveBeenCalledWith(
      EnvironmentType.PRODUCTION,
      BREEZ_API_KEY,
      expectedConfig,
    );
    expect(connect).toHaveBeenCalledWith(config, seed, expect.any(Function));
  });
});
