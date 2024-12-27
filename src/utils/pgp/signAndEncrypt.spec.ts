import OpenPGP from "react-native-fast-openpgp";
import { defaultAccount, setAccount } from "../account/account";
import { signAndEncrypt } from "./signAndEncrypt";

describe("signAndEncrypt", () => {
  beforeEach(() => {
    setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: "publicKey",
        privateKey: "privateKey",
      },
    });
  });

  it("signs and encrypts the message", async () => {
    jest.spyOn(OpenPGP, "sign").mockResolvedValueOnce("signature");
    jest.spyOn(OpenPGP, "encrypt").mockResolvedValueOnce("encrypted");

    const result = await signAndEncrypt("message", "publicKey");
    expect(OpenPGP.sign).toHaveBeenCalledWith("message", "privateKey", "");
    expect(OpenPGP.encrypt).toHaveBeenCalledWith("message", "publicKey");
    expect(result).toEqual({
      signature: "signature",
      encrypted: "encrypted",
    });
  });
});
