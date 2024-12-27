import OpenPGP from "react-native-fast-openpgp";
import { defaultAccount, setAccount } from "../account/account";
import { signAndEncryptSymmetric } from "./signAndEncryptSymmetric";

describe("signAndEncryptSymmetric", () => {
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
    jest.spyOn(OpenPGP, "encryptSymmetric").mockResolvedValueOnce("encrypted");

    const result = await signAndEncryptSymmetric("message", "password");
    expect(OpenPGP.sign).toHaveBeenCalledWith("message", "privateKey", "");
    expect(OpenPGP.encryptSymmetric).toHaveBeenCalledWith(
      "message",
      "password",
      undefined,
      { cipher: 2 },
    );
    expect(result).toEqual({
      signature: "signature",
      encrypted: "encrypted",
    });
  });
});
