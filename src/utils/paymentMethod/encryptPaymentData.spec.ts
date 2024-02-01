import { encryptPaymentData } from "./encryptPaymentData";

const symmetricKey = "symmetricKey";
const signature = "signature";
const encrypted = "encrypted";
const signAndEncryptSymmetricMock = jest.fn().mockResolvedValue({
  signature,
  encrypted,
});
jest.mock("../pgp/signAndEncryptSymmetric", () => ({
  signAndEncryptSymmetric: (...args: unknown[]) =>
    signAndEncryptSymmetricMock(...args),
}));

describe("encryptPaymentData", () => {
  const paymentDataInfo: PaymentDataInfo = {
    beneficiary: "Hal Finney",
    iban: "IE29 AIBK 9311 5212 3456 78",
    bic: "AAAA BB CC 123",
  };
  it("should encrypt payment data", async () => {
    const result = await encryptPaymentData(paymentDataInfo, symmetricKey);
    expect(result).toEqual({
      signature,
      encrypted,
    });
    expect(signAndEncryptSymmetricMock).toHaveBeenCalledWith(
      JSON.stringify(paymentDataInfo),
      symmetricKey,
    );
  });
});
