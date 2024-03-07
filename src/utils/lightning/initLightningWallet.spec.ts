import {
  EnvironmentType,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
} from "@breeztech/react-native-breez-sdk";
import { BREEZ_API_KEY, BREEZ_INVITE_CODE } from "@env";
import { initLightningWallet } from "./initLightningWallet";

jest.mock("@breeztech/react-native-breez-sdk");
const seed = [1, 2, 2];
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .mnemonicToSeed.mockResolvedValue(seed);

const config = {
  breezserver: "unittest",
};
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .defaultConfig.mockResolvedValue(config);

describe("initLightningWallet", () => {
  const mnemonic = "mom mom mom mom mom mom mom mom mom mom mom mom";
  it("should initialise breez sdk lightning wallet", async () => {
    await initLightningWallet(mnemonic, BREEZ_API_KEY, BREEZ_INVITE_CODE);
    expect(mnemonicToSeed).toHaveBeenCalledWith(mnemonic);
    expect(defaultConfig).toHaveBeenCalledWith(
      EnvironmentType.PRODUCTION,
      BREEZ_API_KEY,
      {
        config: { inviteCode: BREEZ_INVITE_CODE },
        type: NodeConfigVariant.GREENLIGHT,
      },
    );
    expect(connect).toHaveBeenCalledWith(config, seed, expect.any(Function));
  });
});
