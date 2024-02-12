import { ElementsValue, address } from "liquidjs-lib";
import { contract } from "../../../../peach-api/src/testData/contract";
import { asset, liquidAddresses } from "../../../../tests/unit/data/liquidNetworkData";
import { constructLiquidPSBT } from "../../../../tests/unit/helpers/constructLiquidPSBT";
import { constructPSBT } from "../../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { CENT } from "../../../constants";
import { defaultConfig } from "../../../store/configStore/configStore";
import { SIGHASH } from "../../../utils/bitcoin/constants";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { releaseTransactionHasValidOutputs } from "./releaseTransactionHasValidOutputs";

describe("releaseTransactionHasValidOutputs", () => {
  const wallet = createTestWallet();
  const liquidContract = {...contract, releaseAddress: liquidAddresses.regtest[0]}
  const psbt = constructPSBT(wallet, undefined, {
    value: contract.amount,
    address: contract.releaseAddress,
  });
  const feeAmount = contract.amount * defaultConfig.peachFee;
  const psbtWithFeeOutput = constructPSBT(wallet, undefined, {
    value: contract.amount - feeAmount,
    address: contract.releaseAddress,
  });
  const liquidPSBTWithFeeOutput = constructLiquidPSBT(wallet, undefined, {
    value: ElementsValue.fromNumber(contract.amount - feeAmount).bytes,
    script: address.toOutputScript(liquidContract.releaseAddress, getLiquidNetwork()),
  });

  psbtWithFeeOutput.addOutput({
    address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
    value: feeAmount,
  });
  liquidPSBTWithFeeOutput.addOutput({
    script: address.toOutputScript(liquidAddresses.regtest[1], getLiquidNetwork()),
    value: ElementsValue.fromNumber(feeAmount).bytes,
    asset: asset.regtest,
    nonce: Buffer.from('00', 'hex'),
  });
  const batchPSBT = constructPSBT(
    wallet,
    { sighashType: SIGHASH.SINGLE_ANYONECANPAY },
    { value: contract.amount - feeAmount, address: contract.releaseAddress },
  );
  const contractWithNoBuyerFee = { ...contract, buyerFee: 0 };
  const peachFee = 2 / CENT;

  it("should return false if peachFee output is missing", () => {
    expect(
      releaseTransactionHasValidOutputs(
        psbt,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if peachFee output is wrong", () => {
    const psbtWithWrongFeeOutput = constructPSBT(wallet, undefined, {
      value: contract.amount - feeAmount / 2,
      address: contract.releaseAddress,
    });
    psbtWithWrongFeeOutput.addOutput({
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: feeAmount / 2,
    });
    expect(
      releaseTransactionHasValidOutputs(
        psbtWithWrongFeeOutput,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if buyer output is missing", () => {
    const psbtWithoutBuyerOutput = constructPSBT(wallet, undefined, {
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: feeAmount,
    });
    expect(
      releaseTransactionHasValidOutputs(
        psbtWithoutBuyerOutput,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if buyer output does not match release address", () => {
    const contractWithDifferentAddress = {
      ...contract,
      buyerFee: 0.02,
      releaseAddress: "differentAddress",
    };
    expect(
      releaseTransactionHasValidOutputs(
        psbt,
        contractWithDifferentAddress,
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if buyer output amount is wrong", () => {
    const contractWithDifferentAmount = {
      ...contract,
      buyerFee: 0.02,
      amount: contract.amount * 2,
    };
    expect(
      releaseTransactionHasValidOutputs(
        psbtWithFeeOutput,
        contractWithDifferentAmount,
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if there are more than 2 outputs", () => {
    const psbtWith3Outputs = constructPSBT(wallet, undefined, {
      value: contract.amount - feeAmount,
      address: contract.releaseAddress,
    });
    psbtWith3Outputs.addOutput({
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: feeAmount,
    });
    psbtWith3Outputs.addOutput({
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: feeAmount,
    });
    expect(
      releaseTransactionHasValidOutputs(
        psbtWith3Outputs,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if there are more than 1 output for free trades", () => {
    expect(
      releaseTransactionHasValidOutputs(
        psbtWithFeeOutput,
        contractWithNoBuyerFee,
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return false if there are more than 1 output for batch psbts", () => {
    const invalidBatchPSBT = constructPSBT(
      wallet,
      { sighashType: SIGHASH.SINGLE_ANYONECANPAY },
      { value: contract.amount - feeAmount, address: contract.releaseAddress },
    );
    invalidBatchPSBT.addOutput({
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: feeAmount,
    });
    expect(
      releaseTransactionHasValidOutputs(
        invalidBatchPSBT,
        contractWithNoBuyerFee,
        peachFee,
      ),
    ).toBeFalsy();
  });
  it("should return true for valid PSBTs outputs", () => {
    expect(
      releaseTransactionHasValidOutputs(
        psbtWithFeeOutput,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeTruthy();
  });
  it("should return true for valid liquid PSBTs outputs", () => {
    expect(
      releaseTransactionHasValidOutputs(
        liquidPSBTWithFeeOutput,
        { ...liquidContract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeTruthy();
  });
  it("should return true for valid PSBT and free trade for buyer", () => {
    expect(
      releaseTransactionHasValidOutputs(psbt, contractWithNoBuyerFee, peachFee),
    ).toBeTruthy();
  });
  it("should return true for a contract with a large amount", () => {
    const contractWithLargeAmount = { ...contract, amount: 3020000 };
    const largeFeeAmount =
      contractWithLargeAmount.amount * defaultConfig.peachFee;
    const largeAmountPsbt = constructPSBT(wallet, undefined, {
      value: contractWithLargeAmount.amount - largeFeeAmount,
      address: contractWithLargeAmount.releaseAddress,
    });
    largeAmountPsbt.addOutput({
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      value: largeFeeAmount,
    });

    expect(
      releaseTransactionHasValidOutputs(
        largeAmountPsbt,
        { ...contractWithLargeAmount, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeTruthy();
  });
  it("should return true for valid PSBTs outputs for batched tx", () => {
    expect(
      releaseTransactionHasValidOutputs(
        batchPSBT,
        { ...contract, buyerFee: 0.02 },
        peachFee,
      ),
    ).toBeTruthy();
  });
});
