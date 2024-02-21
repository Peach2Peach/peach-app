import CryptoJS from "react-native-crypto-js";
import * as accountData from "../../../tests/unit/data/accountData";
import { decryptAccount } from "./decryptAccount";

describe("decryptAccount", () => {
  it("would decrypt recovery account", () => {
    CryptoJS.AES.decrypt = jest.fn().mockImplementationOnce((data) => data);
    const [recoveredAccount, err] = decryptAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: "mockpassword",
    });
    expect(!err).toBe(true);
    expect(recoveredAccount).toStrictEqual(accountData.recoveredAccount);
  });
});
