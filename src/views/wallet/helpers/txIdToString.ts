
import { TransactionInterface } from "bdk-rn";

export function txIdToString(transaction: TransactionInterface): string {
    const txidBytes = transaction.computeTxid().serialize();
    return Buffer
        .from(txidBytes)
        .reverse()
        .toString("hex");
}

export function bytesToHex(bytes: ArrayBuffer): string {
    return Buffer.from(new Uint8Array(bytes)).toString("hex");
}