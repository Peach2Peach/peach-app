import OpenPGP from "react-native-fast-openpgp";
import { decryptSymmetricKey } from "./decryptSymmetricKey";

const verifyMock = jest.spyOn(OpenPGP, "verify");
// factory mocks: the real modules pull in the account store and immer's ESM
// build, which jest cannot parse
jest.mock("../../../utils/pgp/decrypt", () => ({ decrypt: jest.fn() }));
jest.mock("../../../utils/log/log", () => ({ log: jest.fn() }));
jest.mock("../../../utils/log/error", () => ({ error: jest.fn() }));
const decryptMock = jest.requireMock("../../../utils/pgp/decrypt").decrypt;
const errorSpy = jest.spyOn(
  jest.requireMock("../../../utils/log/error"),
  "error",
);

describe("decryptSymmetricKey", () => {
  const symmetricKeyEncrypted = "encrypted symmetric key";
  const symmetricKeySignature = "symmetric key signature";
  const pgpPublicKeys = [{ publicKey: "pgp public key" }];
  const symmetricKey = "symmetric key";
  it("should return symmetric key on successful decryption", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValue(true);
    const symmetricKeyResult = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKeys,
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should return symmetric key on successful decryption if one publicKey matches signature", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValueOnce(false);
    verifyMock.mockResolvedValueOnce(true);
    const symmetricKeyResult = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      [...pgpPublicKeys, ...pgpPublicKeys],
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should handle failed decryption", async () => {
    decryptMock.mockImplementation(() => {
      throw new Error("DECRYPTION_FAILED");
    });
    const symmetricKeyResult = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKeys,
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(symmetricKeyResult).toEqual(null);
  });
  it("should reject the symmetric key when the signature is invalid", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    verifyMock.mockResolvedValue(false);
    const symmetricKeyResult = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKeys,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      new Error("SYMMETRIC_KEY_SIGNATURE_INVALID"),
    );
    expect(symmetricKeyResult).toBeNull();
  });
});
