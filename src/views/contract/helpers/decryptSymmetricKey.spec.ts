import OpenPGP from "react-native-fast-openpgp";
import { decryptSymmetricKey } from "./decryptSymmetricKey";

const verifyMock = jest.spyOn(OpenPGP, "verify");
jest.mock("../../../utils/pgp/decrypt");
const decryptMock = jest.requireMock("../../../utils/pgp/decrypt").decrypt;
const errorSpy = jest.spyOn(
  jest.requireMock("../../../utils/log/error"),
  "error",
);

describe("decryptSymmetricKey", () => {
  const symmetricKeyEncrypted = "encrypted symmetric key";
  const symmetricKey = "symmetric key";
  it("should return symmetric key on successful decryption", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValue(true);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should return symmetric key on successful decryption if one publicKey matches signature", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValueOnce(false);
    verifyMock.mockResolvedValueOnce(true);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should handle failed decryption", async () => {
    decryptMock.mockImplementation(() => {
      throw new Error("DECRYPTION_FAILED");
    });
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(null);
  });
  it("should handle invalid signature and still return symmetric key", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValue(false);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(errorSpy).toHaveBeenCalledWith(
      new Error("SYMMETRIC_KEY_SIGNATURE_INVALID"),
    );
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
});
