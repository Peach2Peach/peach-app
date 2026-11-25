import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib, payments } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getEscrowWallet } from "../wallet/getEscrowWallet";
import { getNetwork } from "../wallet/getNetwork";
import { getSingleSigEscrowAddress } from "../wallet/singleSigEscrow";
import {
  getExpectedSellOfferEscrowAddress,
  isValidSellOfferEscrow,
} from "./verifySellOfferEscrow";

initEccLib(ecc);

const testWallet = createTestWallet();
const mockTestWallet = testWallet;
jest.mock("../wallet/getWallet", () => ({
  getWallet: () => mockTestWallet,
}));

const escrowOf = (offerId: string, derivationPathVersion?: number) =>
  getSingleSigEscrowAddress(
    getEscrowWallet(testWallet, offerId, derivationPathVersion).publicKey,
  );

describe("verifySellOfferEscrow", () => {
  it("accepts the taproot escrow derived at the offer index", () => {
    const address = escrowOf("52");
    expect(getExpectedSellOfferEscrowAddress({ id: "52" })).toBe(address);
    expect(isValidSellOfferEscrow({ id: "52" }, address)).toBe(true);
  });

  it("uses the derivation path version of the offer", () => {
    const address = escrowOf("52", 2);
    expect(
      isValidSellOfferEscrow({ id: "52", derivationPathVersion: 2 }, address),
    ).toBe(true);
    expect(isValidSellOfferEscrow({ id: "52" }, address)).toBe(false);
  });

  it("uses the original offer's key for a republished offer", () => {
    expect(
      isValidSellOfferEscrow({ id: "60", oldOfferId: "52" }, escrowOf("52")),
    ).toBe(true);
  });

  it("rejects the escrow of another offer", () => {
    expect(isValidSellOfferEscrow({ id: "52" }, escrowOf("53"))).toBe(false);
  });

  it("rejects a non taproot address, even for our own key", () => {
    const p2wpkh = payments.p2wpkh({
      pubkey: getEscrowWallet(testWallet, "52").publicKey,
      network: getNetwork(),
    }).address;
    expect(isValidSellOfferEscrow({ id: "52" }, p2wpkh)).toBe(false);
  });

  it("rejects missing or garbage addresses", () => {
    expect(isValidSellOfferEscrow({ id: "52" }, undefined)).toBe(false);
    expect(isValidSellOfferEscrow({ id: "52" }, "")).toBe(false);
    expect(isValidSellOfferEscrow({ id: "52" }, "not an address")).toBe(false);
  });
});
