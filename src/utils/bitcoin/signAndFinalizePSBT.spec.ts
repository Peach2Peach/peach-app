import { constructLiquidPSBT } from "../../../tests/unit/helpers/constructLiquidPSBT";
import { constructPSBT } from "../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { signAndFinalizePSBT } from "./signAndFinalizePSBT";

describe("signAndFinalizePSBT", () => {
  const wallet = createTestWallet();

  it("signs and finalizes a PSBT", () => {
    const psbt = constructPSBT(wallet);

    const signedPSBT = signAndFinalizePSBT(psbt, wallet);
    expect(signedPSBT.data.inputs[0].finalScriptWitness?.toString("hex")).toBe(
      "0347304402202234af2dccac5f8818300ca194ec6a26e32a73f3b18a7d63eec236a32778c061022064f55f412ea99d2eb6234dfba48ff39d9a051c53ca360fe95c24e21298b8f202010101232102e327f0e1669a6c9aa052c861ba13a966972d1ba6b2e4f793c9a1ce4b06950231ac",
    );
  });
  it("signs and finalizes a liquid PSBT", () => {
    const psbt = constructLiquidPSBT(wallet);

    const signedPSBT = signAndFinalizePSBT(psbt, wallet);
    expect(signedPSBT.data.inputs[0].finalScriptWitness?.toString("hex")).toBe(
      "03473044022058f839ff12739544e462bbf39622a0d26823be2d82f0142ee8501b3679339ef9022029c9e98c87b345d90f70b335cd02899d4889198b8e99ea4e25ccd8ef5263f1c2010101232102e327f0e1669a6c9aa052c861ba13a966972d1ba6b2e4f793c9a1ce4b06950231ac",
    );
  });
});
