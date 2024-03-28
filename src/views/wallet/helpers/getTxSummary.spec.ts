import { getTxSummary } from "./getTxSummary";

jest.mock("../../../utils/transaction/txIsConfirmed", () => ({
  txIsConfirmed: jest.fn(() => true),
}));

const txId = "123";
const baseTx = {
  txid: txId,
  received: 0,
  sent: 0,
  confirmationTime: {
    height: 1,
    timestamp: 1234567890,
  },
};
const receivedTx = { ...baseTx, received: 100000000 };
const sentTx = { ...baseTx, sent: 100000000 };
const timestamp = 1234567890000;
const baseSummary = {
  id: "123",
  amount: 100000000,
  date: new Date(timestamp),
  height: 1,
  confirmed: true,
};

jest.useFakeTimers();

describe("getTxSummary", () => {
  it("returns transaction summary", () => {
    expect(getTxSummary(receivedTx)).toEqual(baseSummary);
    expect(getTxSummary(sentTx)).toEqual(baseSummary);
  });
});
