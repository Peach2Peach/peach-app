import ecc from "@bitcoinerlab/secp256k1";
import { Psbt, initEccLib } from "bitcoinjs-lib";
import { constructPSBT } from "../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getEscrowWallet } from "./getEscrowWallet";
import { getNetwork } from "./getNetwork";
import { signAndFinalizeEscrowPSBT, signEscrowPSBT } from "./signEscrowPSBT";
import { getSingleSigEscrowScript, toXOnly } from "./singleSigEscrow";

initEccLib(ecc);

const SCHNORR_SIGNATURE_HEX_LENGTH = 128;
const SCHNORR_SIGNATURE_BYTES = 64;
const FUNDING_AMOUNT = 250000;
const REFUND_AMOUNT = 249000;
const TXID_HEX_LENGTH = 64;
const TXID = "a".repeat(TXID_HEX_LENGTH);
const RETURN_ADDRESS =
  "bcrt1q348u075ehsuk0rz9lat22zrhlpgspj4twmt3m3pf0e5jjdm98u4qpet6g7";

describe("signEscrowPSBT", () => {
  const wallet = getEscrowWallet(createTestWallet(), "1");

  const singleSigPSBT = () => {
    const psbt = new Psbt({ network: getNetwork() });
    psbt.addInput({
      hash: TXID,
      index: 0,
      witnessUtxo: {
        script: getSingleSigEscrowScript(wallet.publicKey),
        value: FUNDING_AMOUNT,
      },
      tapInternalKey: toXOnly(wallet.publicKey),
    });
    psbt.addOutput({ address: RETURN_ADDRESS, value: REFUND_AMOUNT });
    return psbt;
  };

  it("signs escrowVersion 2 with a 64 byte schnorr signature per input", () => {
    const psbt = singleSigPSBT();

    const signatures = signEscrowPSBT(psbt, wallet, { escrowVersion: 2 });

    expect(signatures).toHaveLength(1);
    expect(signatures[0]).toHaveLength(SCHNORR_SIGNATURE_HEX_LENGTH);
    // SIGHASH_DEFAULT, so no partial sig and no trailing sighash byte
    expect(psbt.data.inputs[0].tapKeySig).toBeDefined();
    expect(psbt.data.inputs[0].partialSig).toBeUndefined();
  });

  it.each([[undefined], [0], [1]])(
    "takes the legacy path for escrowVersion %s",
    (escrowVersion) => {
      const psbt = constructPSBT(wallet);

      const signatures = signEscrowPSBT(psbt, wallet, { escrowVersion });

      expect(signatures).toHaveLength(1);
      // ECDSA with a trailing SIGHASH_ALL byte, never 64 bytes
      expect(signatures[0].length).toBeGreaterThan(SCHNORR_SIGNATURE_HEX_LENGTH);
      expect(psbt.data.inputs[0].partialSig).toHaveLength(1);
      expect(psbt.data.inputs[0].tapKeySig).toBeUndefined();
    },
  );

  it("does not alter the transaction it was given", () => {
    const psbt = singleSigPSBT();
    const before = psbt.txInputs[0].sequence;

    signEscrowPSBT(psbt, wallet, { escrowVersion: 2 });

    expect(psbt.txInputs[0].sequence).toBe(before);
  });
});

describe("signAndFinalizeEscrowPSBT", () => {
  const wallet = getEscrowWallet(createTestWallet(), "1");

  it("finalizes an escrowVersion 2 key path spend on our signature alone", () => {
    const psbt = new Psbt({ network: getNetwork() });
    psbt.addInput({
      hash: TXID,
      index: 0,
      witnessUtxo: {
        script: getSingleSigEscrowScript(wallet.publicKey),
        value: FUNDING_AMOUNT,
      },
      tapInternalKey: toXOnly(wallet.publicKey),
    });
    psbt.addOutput({ address: RETURN_ADDRESS, value: REFUND_AMOUNT });
    const sequence = psbt.txInputs[0].sequence;

    const tx = signAndFinalizeEscrowPSBT(psbt, wallet, { escrowVersion: 2 });

    // key path spend: witness is the single schnorr signature, no script
    expect(tx.ins[0].witness).toHaveLength(1);
    expect(tx.ins[0].witness[0]).toHaveLength(SCHNORR_SIGNATURE_BYTES);
    expect(tx.outs[0].value).toBe(REFUND_AMOUNT);
    // the signature commits to nSequence, so it must survive untouched
    expect(tx.ins[0].sequence).toBe(sequence);
  });

  it("uses the P2WSH finalizer for a legacy escrow", () => {
    const psbt = constructPSBT(wallet);

    const tx = signAndFinalizeEscrowPSBT(psbt, wallet, { escrowVersion: 1 });

    expect(tx.ins[0].witness.length).toBeGreaterThan(1);
  });
});
