import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib, payments, Psbt } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getBuyOfferWallet } from "../wallet/getBuyOfferWallet";
import { getNetwork } from "../wallet/getNetwork";
import {
  getSingleSigEscrowAddress,
  getSingleSigEscrowScript,
  getTweakedEscrowSigner,
  toXOnly,
} from "../wallet/singleSigEscrow";
import {
  checkBuyerOnlyEscrowRefundPsbt,
  MIN_REFUND_FEE_RATE_CEILING,
} from "./checkBuyerOnlyEscrowRefundPsbt";

initEccLib(ecc);

const wallet = createTestWallet();
const escrowKey = getBuyOfferWallet(wallet, "34");
const escrow = getSingleSigEscrowAddress(escrowKey.publicKey);
const escrowScript = getSingleSigEscrowScript(escrowKey.publicKey);

// the buyer's own main wallet, which a refund must never spend
const mainWalletKey = wallet.derivePath("m/84'/1'/0'/0/0");
const mainWalletScript = Buffer.from(
  payments.p2wpkh({ pubkey: mainWalletKey.publicKey, network: getNetwork() })
    .output!,
);
const returnAddress = payments.p2wpkh({
  pubkey: wallet.derivePath("m/84'/1'/0'/0/1").publicKey,
  network: getNetwork(),
}).address!;

const txIdA = "aa".repeat(32);
const txIdB = "bb".repeat(32);
const funding = { txIds: [txIdA], vouts: [1], amounts: [100_000] };

type Input = { txId: string; vout: number; script: Buffer; value: number };
const escrowInput = (txId = txIdA, vout = 1, value = 100_000): Input => ({
  txId,
  vout,
  script: escrowScript,
  value,
});

const buildPsbt = ({
  inputs = [escrowInput()],
  outputs = [{ address: returnAddress, value: 99_500 }],
}: {
  inputs?: Input[];
  outputs?: { address: string; value: number }[];
} = {}) => {
  const psbt = new Psbt({ network: getNetwork() });
  inputs.forEach(({ txId, vout, script, value }) =>
    psbt.addInput({
      hash: txId,
      index: vout,
      witnessUtxo: { script, value },
      tapInternalKey: toXOnly(escrowKey.publicKey),
    }),
  );
  outputs.forEach((output) => psbt.addOutput(output));
  return psbt;
};

const check =
  (
    psbt: Psbt,
    overrides: Partial<
      Parameters<typeof checkBuyerOnlyEscrowRefundPsbt>[0]
    > = {},
  ) =>
  () =>
    checkBuyerOnlyEscrowRefundPsbt({
      psbt,
      escrow,
      funding,
      returnAddress,
      fastestFeeRate: 5,
      ...overrides,
    });

describe("checkBuyerOnlyEscrowRefundPsbt", () => {
  it("accepts a refund of the whole escrow to the return address", () => {
    expect(check(buildPsbt())).not.toThrow();
  });

  it("accepts a refund spending several funding outputs", () => {
    const psbt = buildPsbt({
      inputs: [escrowInput(txIdA, 1, 60_000), escrowInput(txIdB, 0, 40_000)],
    });
    expect(
      check(psbt, {
        funding: {
          txIds: [txIdA, txIdB],
          vouts: [1, 0],
          amounts: [60_000, 40_000],
        },
      }),
    ).not.toThrow();
  });

  it("refuses a refund that does not pay the return address", () => {
    const psbt = buildPsbt({
      outputs: [{ address: escrow, value: 99_000 }],
    });
    expect(check(psbt)).toThrow("RETURN_ADDRESS_MISMATCH");
  });

  it("refuses a refund with a second output", () => {
    const psbt = buildPsbt({
      outputs: [
        { address: returnAddress, value: 50_000 },
        { address: returnAddress, value: 49_000 },
      ],
    });
    expect(check(psbt)).toThrow("RETURN_ADDRESS_MISMATCH");
  });

  it("refuses a refund that also spends a UTXO of the buyer's own wallet", () => {
    const psbt = buildPsbt({
      inputs: [
        escrowInput(),
        { txId: txIdB, vout: 0, script: mainWalletScript, value: 50_000 },
      ],
      outputs: [{ address: returnAddress, value: 149_000 }],
    });
    expect(check(psbt)).toThrow("INVALID_INPUT");
  });

  it("refuses a funding outpoint whose script is not the escrow", () => {
    const psbt = buildPsbt({
      inputs: [{ ...escrowInput(), script: mainWalletScript }],
    });
    expect(check(psbt)).toThrow("INVALID_INPUT");
  });

  it("refuses an input that is not a funding output", () => {
    const psbt = buildPsbt({ inputs: [escrowInput(txIdB)] });
    expect(check(psbt)).toThrow("INVALID_INPUT");
  });

  it("refuses the right txid with another vout", () => {
    const psbt = buildPsbt({ inputs: [escrowInput(txIdA, 0)] });
    expect(check(psbt)).toThrow("INVALID_INPUT");
  });

  it("refuses an input amount that differs from the funding", () => {
    const psbt = buildPsbt({ inputs: [escrowInput(txIdA, 1, 200_000)] });
    expect(check(psbt)).toThrow("INVALID_INPUT");
  });

  it("refuses a refund that leaves funding outputs unspent", () => {
    expect(
      check(buildPsbt(), {
        funding: {
          txIds: [txIdA, txIdB],
          vouts: [1, 0],
          amounts: [100_000, 1],
        },
      }),
    ).toThrow("INVALID_INPUT");
  });

  it("refuses an output worth more than the inputs", () => {
    const psbt = buildPsbt({
      outputs: [{ address: returnAddress, value: 100_001 }],
    });
    expect(check(psbt)).toThrow("INVALID_OUTPUT");
  });

  it("refuses a fee above twice the fastest fee rate", () => {
    const psbt = buildPsbt({
      outputs: [{ address: returnAddress, value: 50_000 }],
    });
    expect(check(psbt, { fastestFeeRate: 50 })).toThrow("FEE_TOO_HIGH");
  });

  it("always allows the minimum ceiling, even when estimates are low", () => {
    // 1 key path input, 1 P2WPKH output: 99 vB
    const fee = 99 * MIN_REFUND_FEE_RATE_CEILING;
    const psbt = buildPsbt({
      outputs: [{ address: returnAddress, value: 100_000 - fee }],
    });
    expect(check(psbt, { fastestFeeRate: 1 })).not.toThrow();

    const tooMuch = buildPsbt({
      outputs: [{ address: returnAddress, value: 100_000 - fee - 1 }],
    });
    expect(check(tooMuch, { fastestFeeRate: 1 })).toThrow("FEE_TOO_HIGH");
  });

  it("estimates the exact size of the signed refund", () => {
    const psbt = buildPsbt({
      inputs: [escrowInput(txIdA, 1, 60_000), escrowInput(txIdB, 0, 40_000)],
    });
    const signer = getTweakedEscrowSigner(escrowKey);
    psbt.txInputs.forEach((_, i) => psbt.signInput(i, signer).finalizeInput(i));
    const vsize = psbt.extractTransaction().virtualSize();

    // exactly at the ceiling passes, one sat more is refused
    const feeRate = 7;
    const atCeiling = buildPsbt({
      inputs: [escrowInput(txIdA, 1, 60_000), escrowInput(txIdB, 0, 40_000)],
      outputs: [
        { address: returnAddress, value: 100_000 - vsize * feeRate * 2 },
      ],
    });
    const twoInputs = {
      txIds: [txIdA, txIdB],
      vouts: [1, 0],
      amounts: [60_000, 40_000],
    };
    expect(
      check(atCeiling, { funding: twoInputs, fastestFeeRate: feeRate }),
    ).not.toThrow();

    const overCeiling = buildPsbt({
      inputs: [escrowInput(txIdA, 1, 60_000), escrowInput(txIdB, 0, 40_000)],
      outputs: [
        { address: returnAddress, value: 100_000 - vsize * feeRate * 2 - 1 },
      ],
    });
    expect(
      check(overCeiling, { funding: twoInputs, fastestFeeRate: feeRate }),
    ).toThrow("FEE_TOO_HIGH");
  });
});
