import { BREEZ_API_KEY } from "@env";
import { account1 } from "../../../tests/unit/data/accountData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { peachAPI } from "../peachAPI";
import { PeachWallet } from "../wallet/PeachWallet";
import { peachLiquidWallet, peachWallet } from "../wallet/setWallet";
import { setWallets } from "./setWallets";

jest.mock("../lightning/initLightningWallet");
const initLightningWalletMock = jest.requireMock(
  "../lightning/initLightningWallet",
).initLightningWallet;

describe("setWallets", () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, "loadWallet");
  const wallet = createTestWallet();
  const breezInviteCode = "breezInviteCode";

  beforeEach(() => {
    useSettingsStore.getState().setBreezInviteCode(breezInviteCode);
  });
  it("loads peach account", async () => {
    await setWallets(wallet, account1.mnemonic);
    expect(peachAPI.apiOptions.peachAccount?.privateKey?.toString("hex")).toBe(
      "ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73",
    );
  });
  it("loads peach wallets", async () => {
    await setWallets(wallet, account1.mnemonic);

    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic);
    expect(peachWallet).toBeDefined();
    expect(peachLiquidWallet?.getAddress().address).toBe(
      "ert1qvd76ucxafly399qewresqmj8ud0f639fep0raj",
    );
    expect(initLightningWalletMock).toHaveBeenCalledWith(
      account1.mnemonic,
      BREEZ_API_KEY,
      breezInviteCode,
    );
  });
  it("does not load LN wallet if no invite code is present", async () => {
    useSettingsStore.getState().reset();

    await setWallets(wallet, account1.mnemonic);

    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic);
    expect(initLightningWalletMock).not.toHaveBeenCalled();
  });
});
