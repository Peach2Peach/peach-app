import { account1 } from "../../../../tests/unit/data/accountData";
import { defaultAccount, setAccount } from "../account";
import { accountStorage } from "../accountStorage";
import { storeIdentity } from "./storeIdentity";

describe("storeIdentity", () => {
  beforeEach(() => {
    setAccount(defaultAccount);
  });

  it("should store identity", async () => {
    await storeIdentity(account1);
    expect(accountStorage.setMapAsync).toHaveBeenCalledWith("identity", {
      publicKey: account1.publicKey,
      base58: account1.base58,
      mnemonic: account1.mnemonic,
      pgp: account1.pgp,
    });
  });
});
