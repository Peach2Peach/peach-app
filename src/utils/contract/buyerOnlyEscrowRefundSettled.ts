import { createStorage } from "../storage/createStorage";

/**
 * Contracts that were refunded or can never need a refund from us, so old
 * canceled trades aren't fetched again on every app open.
 *
 * Keyed by id AND creation date: contract ids are built from offer ids, which
 * can repeat (e.g. after a regtest reset), and a new contract must never be
 * skipped because an older one with the same id was settled.
 */
const storage = createStorage("buyerOnlyEscrowRefunds");
const SETTLED_KEY = "settledContracts";

type ContractRef = { id: string; creationDate: Date | string | number };

const toKey = ({ id, creationDate }: ContractRef) =>
  `${id}@${new Date(creationDate).getTime()}`;

const getSettled = () =>
  new Set((storage.getArray<string>(SETTLED_KEY) ?? []).map(String));

export const isBuyerOnlyEscrowRefundSettled = (contract: ContractRef) =>
  getSettled().has(toKey(contract));

export const markBuyerOnlyEscrowRefundSettled = (contract: ContractRef) => {
  const settled = getSettled();
  settled.add(toKey(contract));
  storage.setArray(SETTLED_KEY, [...settled]);
};
