import { NETWORK } from "@env";
import OpenPGP from "react-native-fast-openpgp";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getMainAccount } from "../../../utils/account/getMainAccount";
import { signMessageWithWallet } from "../../../utils/account/signMessageWithWallet";
import {
  countersignEncryptedTradeDetails,
  isInvalidTradeDetailsError,
} from "./countersignEncryptedTradeDetails";

// mocked: importing the real account store pulls in immer's ESM build,
// which this jest setup cannot parse
jest.mock("../../../utils/account/account", () => ({
  useAccountStore: {
    getState: () => ({
      account: { pgp: { publicKey: "publicKey", privateKey: "privateKey" } },
    }),
  },
}));

const buyerWallet = createTestWallet();
const buyerId = getMainAccount(buyerWallet, NETWORK).publicKey.toString("hex");

const details = {
  buyer: buyerId,
  seller: "sellerId",
  offerId: 52,
  paymentMethod: "wise",
  amount: "30000",
  price: 16.6,
  premium: 1.5,
  currency: "EUR",
};
const expected = {
  seller: "sellerId",
  buyer: buyerId,
  offerId: "52",
  amount: 30000,
  paymentMethod: "wise",
  currency: "EUR",
};
const args = {
  encryptedTradeDetails: "encrypted",
  encryptedTradeDetailsBuyerSignature: "buyerSignature",
  buyerPgpPublicKeys: [
    {
      publicKey: "buyerPublicKey",
      proof: signMessageWithWallet("buyerPublicKey", buyerWallet),
    },
  ],
  expected,
};

describe("countersignEncryptedTradeDetails", () => {
  it("signs the exact plaintext when everything checks out", async () => {
    const plaintext = JSON.stringify(details);
    jest.spyOn(OpenPGP, "decrypt").mockResolvedValueOnce(plaintext);
    jest.spyOn(OpenPGP, "verify").mockResolvedValueOnce(true);
    jest.spyOn(OpenPGP, "sign").mockResolvedValueOnce("sellerSignature");

    await expect(countersignEncryptedTradeDetails(args)).resolves.toBe(
      "sellerSignature",
    );
    expect(OpenPGP.verify).toHaveBeenCalledWith(
      "buyerSignature",
      plaintext,
      "buyerPublicKey",
    );
    expect(OpenPGP.sign).toHaveBeenCalledWith(plaintext, "privateKey", "");
  });

  it("refuses when the buyer signature is invalid", async () => {
    jest
      .spyOn(OpenPGP, "decrypt")
      .mockResolvedValueOnce(JSON.stringify(details));
    jest.spyOn(OpenPGP, "verify").mockResolvedValueOnce(false);

    const err = await countersignEncryptedTradeDetails(args).catch((e) => e);
    expect(isInvalidTradeDetailsError(err)).toBe(true);
    expect(err.message).toBe("invalid buyer signature");
  });

  it("refuses when the details describe another trade", async () => {
    jest
      .spyOn(OpenPGP, "decrypt")
      .mockResolvedValueOnce(
        JSON.stringify({ ...details, offerId: 53, currency: "CHF" }),
      );
    jest.spyOn(OpenPGP, "verify").mockResolvedValueOnce(true);

    const err = await countersignEncryptedTradeDetails(args).catch((e) => e);
    expect(isInvalidTradeDetailsError(err)).toBe(true);
    expect(err.message).toBe("trade details mismatch: offerId, currency");
  });

  it("refuses when the trade details are missing", async () => {
    const err = await countersignEncryptedTradeDetails({
      ...args,
      encryptedTradeDetails: undefined,
    }).catch((e) => e);
    expect(isInvalidTradeDetailsError(err)).toBe(true);
  });

  it("refuses when the buyer's key has no valid ownership proof", async () => {
    jest
      .spyOn(OpenPGP, "decrypt")
      .mockResolvedValueOnce(JSON.stringify(details));
    const verify = jest.spyOn(OpenPGP, "verify").mockResolvedValue(true);

    const err = await countersignEncryptedTradeDetails({
      ...args,
      buyerPgpPublicKeys: [{ publicKey: "buyerPublicKey", proof: "abcd" }],
    }).catch((e) => e);
    expect(isInvalidTradeDetailsError(err)).toBe(true);
    expect(err.message).toBe("invalid buyer signature");
    expect(verify).not.toHaveBeenCalled();
  });
});
