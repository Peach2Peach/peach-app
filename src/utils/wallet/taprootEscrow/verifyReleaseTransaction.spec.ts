import ecc from "@bitcoinerlab/secp256k1";
import { Transaction, address, networks, payments } from "bitcoinjs-lib";
import { deriveTaprootEscrow } from "./deriveTaprootEscrow";
import { verifyReleaseTransaction } from "./verifyReleaseTransaction";

const sellerPublicKey = Buffer.from(
  ecc.pointFromScalar(
    Buffer.from(
      "be01d8dcf3879a0fec05130ca95d35bf7823833e3cdf91e310408606717055d9",
      "hex",
    ),
    true,
  )!,
);
const peachPublicKey = Buffer.from(
  ecc.pointFromScalar(
    Buffer.from(
      "644b07a5cb70f68316cd9a51cabdc61c4d0b1f38b189d0c92370a3844fd0241f",
      "hex",
    ),
    true,
  )!,
);

const escrow = deriveTaprootEscrow({
  sellerPublicKey,
  peachPublicKey,
  expiry: 4320,
});

const fundingTxId =
  "6a1e8fcd8c2b3f9d0e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e";
const fundingAmount = 1000000;
const funding: FundingStatus = {
  status: "FUNDED",
  txIds: [fundingTxId],
  vouts: [0],
  amounts: [fundingAmount],
  expiry: 4320,
};

const releaseAddress = payments.p2wpkh({
  pubkey: sellerPublicKey,
  network: networks.regtest,
}).address!;

function buildReleaseTransaction({
  txId = fundingTxId,
  vout = 0,
  outputs = [{ address: releaseAddress, value: fundingAmount - 10000 }],
}: {
  txId?: string;
  vout?: number;
  outputs?: { address: string; value: number }[];
} = {}) {
  const transaction = new Transaction();
  transaction.version = 2;
  transaction.addInput(Buffer.from(txId, "hex").reverse(), vout);
  outputs.forEach((output) =>
    transaction.addOutput(
      address.toOutputScript(output.address, networks.regtest),
      output.value,
    ),
  );
  return transaction;
}

const getSighash = (transaction: Transaction) =>
  transaction.hashForWitnessV1(
    0,
    [escrow.script],
    [fundingAmount],
    Transaction.SIGHASH_DEFAULT,
  );

describe("verifyReleaseTransaction", () => {
  it("accepts a release transaction that spends the escrow and pays the buyer", () => {
    const transaction = buildReleaseTransaction();

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash: getSighash(transaction),
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).not.toThrow();
  });

  it("rejects a sighash that does not belong to the transaction", () => {
    const transaction = buildReleaseTransaction();

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash: Buffer.alloc(32, 7),
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).toThrow("TAPROOT_RELEASE_SIGHASH_MISMATCH");
  });

  it("rejects a transaction that does not pay the buyer", () => {
    const otherAddress = payments.p2wpkh({
      pubkey: peachPublicKey,
      network: networks.regtest,
    }).address!;
    const transaction = buildReleaseTransaction({
      outputs: [{ address: otherAddress, value: fundingAmount - 10000 }],
    });

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash: getSighash(transaction),
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).toThrow("TAPROOT_RELEASE_ADDRESS_MISMATCH");
  });

  it("rejects a transaction that spends an unknown input", () => {
    const transaction = buildReleaseTransaction({ vout: 1 });

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash: getSighash(transaction),
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).toThrow("TAPROOT_RELEASE_UNKNOWN_INPUT");
  });

  it("rejects a transaction that spends more than the escrow holds", () => {
    const transaction = buildReleaseTransaction({
      outputs: [{ address: releaseAddress, value: fundingAmount + 1 }],
    });

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash: getSighash(transaction),
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).toThrow("TAPROOT_RELEASE_INVALID_OUTPUT");
  });

  it("rejects a transaction with more than one input", () => {
    const transaction = buildReleaseTransaction();
    const sighash = getSighash(transaction);
    // a MuSig2 session only ever signs one input
    transaction.addInput(Buffer.from(fundingTxId, "hex").reverse(), 1);

    expect(() =>
      verifyReleaseTransaction({
        unsignedTx: transaction.toHex(),
        sighash,
        escrow,
        releaseAddress,
        funding,
        network: networks.regtest,
      }),
    ).toThrow("TAPROOT_RELEASE_UNEXPECTED_INPUT_COUNT");
  });
});
