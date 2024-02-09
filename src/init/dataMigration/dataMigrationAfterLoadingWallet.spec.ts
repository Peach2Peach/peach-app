import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { storeBase58 } from "./afterLoadingWallet/storeBase58";
import { dataMigrationAfterLoadingWallet } from "./dataMigrationAfterLoadingWallet";

jest.mock("./afterLoadingWallet/storeBase58");

describe("dataMigrationAfterLoadingWallet", () => {
  const account = {
    publicKey: "",
  } as Account;
  const wallet = createTestWallet();

  it("should call storeBase58", () => {
    dataMigrationAfterLoadingWallet(wallet, account);
    expect(storeBase58).toHaveBeenCalledWith(wallet, account);
  });
});
