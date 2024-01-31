import { contract } from "../../../../peach-api/src/testData/contract";
import { constructPSBT } from "../../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { SIGHASH } from "../../../utils/bitcoin/constants";
import { isPSBTForBatch } from "./isPSBTForBatch";

describe("isPSBTForBatch", () => {
  const wallet = createTestWallet();
  const psbt = constructPSBT(wallet, undefined, {
    value: 100000,
    address: contract.releaseAddress,
  });
  const batchPSBT = constructPSBT(
    wallet,
    { sighashType: SIGHASH.SINGLE_ANYONECANPAY },
    { value: 10000 },
  );

  it("should return false if PSBT is regular transaction", () => {
    expect(isPSBTForBatch(psbt)).toBeFalsy();
  });

  it("should return true for PSBTs for batched tx", () => {
    expect(isPSBTForBatch(batchPSBT)).toBeTruthy();
  });
});
