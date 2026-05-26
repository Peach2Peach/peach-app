import { ChainPosition_Tags, Network, NetworkKind } from "bdk-rn";
import type { CanonicalTx, TransactionInterface } from "bdk-rn";

export const BlockChainNames = {
  Electrum: "Electrum",
  Esplora: "Esplora",
  Rpc: "Rpc",
} as const;
export type BlockChainNames = (typeof BlockChainNames)[keyof typeof BlockChainNames];

export const AddressIndex = {
  New: "new",
  LastUnused: "lastUnused",
} as const;
export type AddressIndex = (typeof AddressIndex)[keyof typeof AddressIndex];

export type WalletTxInner = { hex: string; id: string; vsize: number };

export type WalletTx = {
  txid: string;
  sent: number;
  received: number;
  fee?: number;
  confirmationTime?: { height: number; timestamp: number };
  transaction?: WalletTxInner;
};

export type BitcoinNetwork = "bitcoin" | "testnet" | "regtest" | "signet";

export const bdkNetwork = (network: BitcoinNetwork | string): Network => {
  switch (network) {
    case "bitcoin":
      return Network.Bitcoin;
    case "testnet":
      return Network.Testnet;
    case "regtest":
      return Network.Regtest;
    case "signet":
      return Network.Signet;
    default:
      return Network.Bitcoin;
  }
};

export const bdkNetworkKind = (network: BitcoinNetwork | string): NetworkKind =>
  network === "bitcoin" ? NetworkKind.Main : NetworkKind.Test;

export const bytesToHex = (b: ArrayBuffer | Uint8Array): string =>
  Buffer.from(b as ArrayBuffer).toString("hex");

export const hexToBytes = (hex: string): Uint8Array =>
  Uint8Array.from(Buffer.from(hex, "hex"));

export const transactionToInner = (
  tx: TransactionInterface,
): WalletTxInner => ({
  hex: bytesToHex(tx.serialize()),
  id: tx.computeTxid().toString(),
  vsize: Number(tx.vsize()),
});

export const canonicalTxToWalletTx = (
  canonical: CanonicalTx,
  sent: bigint,
  received: bigint,
  fee: bigint | undefined,
): WalletTx => {
  const inner = transactionToInner(canonical.transaction);
  const result: WalletTx = {
    txid: inner.id,
    sent: Number(sent),
    received: Number(received),
    fee: fee !== undefined ? Number(fee) : undefined,
    transaction: inner,
  };
  if (canonical.chainPosition.tag === ChainPosition_Tags.Confirmed) {
    const cp = canonical.chainPosition.inner;
    result.confirmationTime = {
      height: cp.confirmationBlockTime.blockId.height,
      timestamp: Number(cp.confirmationBlockTime.confirmationTime),
    };
  }
  return result;
};
