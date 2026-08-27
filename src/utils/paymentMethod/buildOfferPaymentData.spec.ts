jest.mock("../pgp/signAndEncrypt", () => ({
  signAndEncrypt: jest.fn((message: string, publicKey: string) =>
    Promise.resolve({
      encrypted: `encrypted(${publicKey}):${message}`,
      signature: `signature(${publicKey})`,
    }),
  ),
}));

import { buildOfferPaymentData } from "./buildOfferPaymentData";
import { hashPaymentData } from "./hashPaymentData";

const revolut: PaymentData = {
  id: "revolut-1",
  label: "my revolut",
  type: "revolut",
  currencies: ["EUR"],
  userName: "@satoshi",
  phone: "+41791234567",
};

describe("buildOfferPaymentData", () => {
  it("publishes a hash for every detail that gets encrypted", async () => {
    const result = await buildOfferPaymentData({
      originalPaymentData: [revolut],
      myPgpPubKey: "myKey",
      peachPGPPublicKey: "peachKey",
      instantTrade: true,
    });

    const entry = result.revolut;
    if (!entry?.selfEncrypted) throw new Error("no payment data built");

    const encryptedDetails = JSON.parse(
      entry.selfEncrypted.replace("encrypted(myKey):", ""),
    ) as PaymentDataInfo;
    expect(encryptedDetails).toEqual({
      userName: "@satoshi",
      phone: "+41791234567",
    });

    // every encrypted detail has a matching published hash, and vice versa
    expect(entry.hashes).toEqual(
      hashPaymentData(encryptedDetails).map((i) => i.hash),
    );
    expect(entry.hashes).toHaveLength(2);
    expect(entry.encrypted).toContain("peachKey");
  });

  it("omits the peach-encrypted copy when instant trade is off", async () => {
    const result = await buildOfferPaymentData({
      originalPaymentData: [revolut],
      myPgpPubKey: "myKey",
      peachPGPPublicKey: "peachKey",
      instantTrade: false,
    });
    expect(result.revolut?.encrypted).toBeUndefined();
    expect(result.revolut?.selfEncrypted).toBeDefined();
    expect(result.revolut?.hashes).toHaveLength(2);
  });

  it("derives country from the iban and flags mpesa", async () => {
    const result = await buildOfferPaymentData({
      originalPaymentData: [
        {
          id: "sepa-1",
          label: "sepa",
          type: "sepa",
          currencies: ["EUR"],
          beneficiary: "Hal Finney",
          iban: "IE29AIBK93115212345678",
        },
        {
          id: "mpesa-1",
          label: "mpesa",
          type: "m-pesa",
          currencies: ["KES"],
          mpesa_name: "Hal",
          mpesa_phone: "+254700000000",
        },
      ],
      myPgpPubKey: "myKey",
      instantTrade: false,
    });
    expect(result.sepa?.country).toBe("IE");
    expect(result.sepa?.isMpesa).toBe(false);
    // beneficiary is in doNotHash, iban is not
    expect(result.sepa?.hashes).toHaveLength(1);
    expect(result["m-pesa"]?.isMpesa).toBe(true);
  });
});
