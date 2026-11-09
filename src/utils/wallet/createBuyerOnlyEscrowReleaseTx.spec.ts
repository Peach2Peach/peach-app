import ecc from "@bitcoinerlab/secp256k1";
import { Transaction, address, initEccLib, payments } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { createBuyerOnlyEscrowReleaseTx } from "./createBuyerOnlyEscrowReleaseTx";
import { getBuyOfferWallet } from "./getBuyOfferWallet";
import { getNetwork } from "./getNetwork";
import { getSingleSigEscrowScript } from "./singleSigEscrow";

initEccLib(ecc);

const root = createTestWallet();
const wallet = getBuyOfferWallet(root, "123");
const network = getNetwork();
const getAddress = (path: string) =>
  payments.p2wpkh({ pubkey: root.derivePath(path).publicKey, network })
    .address as string;
const releaseAddress = getAddress("m/84'/1'/0'/0/1");
const peachFeeAddress = getAddress("m/84'/1'/0'/0/2");
const funding = {
  txIds: ["11".repeat(32), "22".repeat(32)],
  vouts: [0, 3],
  amounts: [60000, 40000],
};
const params = {
  wallet,
  funding,
  releaseAddress,
  peachFeeAddress,
  peachFeeSats: 2000,
  feeRate: 5,
};

describe("createBuyerOnlyEscrowReleaseTx", () => {
  const tx = Transaction.fromHex(createBuyerOnlyEscrowReleaseTx(params));

  it("spends exactly the funding outputs", () => {
    expect(
      tx.ins.map(
        (input) =>
          `${Buffer.from(input.hash).reverse().toString("hex")}:${input.index}`,
      ),
    ).toEqual([`${"11".repeat(32)}:0`, `${"22".repeat(32)}:3`]);
  });

  it("pays the buyer first and then the Peach fee, nothing else", () => {
    expect(tx.outs).toHaveLength(2);
    expect(address.fromOutputScript(tx.outs[0].script, network)).toBe(
      releaseAddress,
    );
    expect(address.fromOutputScript(tx.outs[1].script, network)).toBe(
      peachFeeAddress,
    );
    expect(tx.outs[1].value).toBe(2000);
  });

  it("takes the mining fee from the payout, at the requested rate", () => {
    const miningFee = 100000 - tx.outs[0].value - tx.outs[1].value;
    expect(miningFee).toBe(Math.ceil(tx.virtualSize() * 5));
  });

  it("has one valid 64 byte SIGHASH_DEFAULT signature per input", () => {
    const script = getSingleSigEscrowScript(wallet.publicKey);
    const outputKey = script.subarray(2);
    tx.ins.forEach((input, i) => {
      expect(input.witness).toHaveLength(1);
      expect(input.witness[0]).toHaveLength(64);
      const hash = tx.hashForWitnessV1(
        i,
        [script, script],
        funding.amounts,
        Transaction.SIGHASH_DEFAULT,
      );
      expect(ecc.verifySchnorr(hash, outputKey, input.witness[0])).toBe(true);
    });
  });

  it("omits the fee output on a free trade", () => {
    const freeTrade = Transaction.fromHex(
      createBuyerOnlyEscrowReleaseTx({
        ...params,
        peachFeeAddress: undefined,
        peachFeeSats: 0,
      }),
    );
    expect(freeTrade.outs).toHaveLength(1);
  });

  it("refuses a payout at or below dust", () => {
    expect(() =>
      createBuyerOnlyEscrowReleaseTx({
        ...params,
        funding: { txIds: ["11".repeat(32)], vouts: [0], amounts: [2500] },
      }),
    ).toThrow("INSUFFICIENT_FUNDS");
  });

  it("refuses inconsistent funding data", () => {
    expect(() =>
      createBuyerOnlyEscrowReleaseTx({
        ...params,
        funding: { ...funding, vouts: [0] },
      }),
    ).toThrow("MISSING_DATA");
  });
});
