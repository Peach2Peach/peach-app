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
});
