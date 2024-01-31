import { account1 } from "../../../tests/unit/data/accountData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { peachAPI } from "../peachAPI";
import { PeachWallet } from "../wallet/PeachWallet";
import { setWallets } from "./setWallets";

describe("setWallets", () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, "loadWallet");
  const wallet = createTestWallet();

  it("loads peach account", async () => {
    await setWallets(wallet, account1.mnemonic);
    expect(peachAPI.apiOptions.peachAccount?.privateKey?.toString("hex")).toBe(
      "ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73",
    );
  });
  it("loads peach wallets", async () => {
    await setWallets(wallet, account1.mnemonic);

    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic);
  });
});
