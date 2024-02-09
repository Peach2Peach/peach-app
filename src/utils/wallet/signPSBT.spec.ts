import { constructPSBT } from "../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { signatureValidator } from "../../../tests/unit/helpers/signatureValidator";
import { SIGHASH } from "../bitcoin/constants";
import { signPSBT } from "./signPSBT";

describe("signPSBT", () => {
  const wallet = createTestWallet();

  it("signs a PSBT", () => {
    const psbt = constructPSBT(wallet);

    const signedPSBT = signPSBT(psbt, wallet);
    expect(
      signedPSBT.validateSignaturesOfAllInputs(signatureValidator),
    ).toBeTruthy();
  });
  it("signs a PSBT with sighash SINGLE|ANYONECANPAY", () => {
    const psbt = constructPSBT(wallet, {
      sighashType: SIGHASH.SINGLE_ANYONECANPAY,
    });

    const signedPSBT = signPSBT(psbt, wallet);
    expect(
      signedPSBT.validateSignaturesOfAllInputs(signatureValidator),
    ).toBeTruthy();
  });
});
