import {
  EnvironmentType,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
} from "@breeztech/react-native-breez-sdk";
import { BREEZ_API_KEY } from "@env";
import { waitFor } from "@testing-library/react-native";
import { nodeInfo } from "../../../tests/unit/data/lightningNetworkData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
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

describe("initLightningWallet", () => {
  const mnemonic = "mom mom mom mom mom mom mom mom mom mom mom mom";
  const inviteCode = "inviteCode";
  it("should initialise breez sdk lightning wallet", async () => {
    await initLightningWallet(mnemonic, BREEZ_API_KEY, inviteCode);
    expect(mnemonicToSeed).toHaveBeenCalledWith(mnemonic);
    expect(defaultConfig).toHaveBeenCalledWith(
      EnvironmentType.PRODUCTION,
      BREEZ_API_KEY,
      {
        config: { inviteCode },
        type: NodeConfigVariant.GREENLIGHT,
      },
    );
    expect(connect).toHaveBeenCalledWith(config, seed, expect.any(Function));
    await waitFor(() =>
      expect(useSettingsStore.getState().breezInviteCode).toBe(inviteCode),
    );
  });
});
