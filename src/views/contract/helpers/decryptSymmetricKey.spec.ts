import { decryptSymmetricKey } from "./decryptSymmetricKey";

jest.mock("../../../utils/pgp/decrypt");
const decryptMock = jest.requireMock("../../../utils/pgp/decrypt").decrypt;

describe("decryptSymmetricKey", () => {
  const symmetricKeyEncrypted = "encrypted symmetric key";
  const symmetricKey = "symmetric key";
  it("should return symmetric key on successful decryption", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should return symmetric key on successful decryption if one publicKey matches signature", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
  it("should handle failed decryption", async () => {
    decryptMock.mockImplementation(() => {
      throw new Error("DECRYPTION_FAILED");
    });
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(symmetricKeyResult).toEqual(null);
  });
  it("should handle invalid signature and still return symmetric key", async () => {
    decryptMock.mockReturnValue(symmetricKey);
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted);
    expect(symmetricKeyResult).toEqual(symmetricKey);
  });
});
