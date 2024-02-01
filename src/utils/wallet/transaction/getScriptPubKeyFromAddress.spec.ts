import { addressScriptPubKeyMock } from "../../../../tests/unit/mocks/bdkRN";
import { getScriptPubKeyFromAddress } from "./getScriptPubKeyFromAddress";

describe("getScriptPubKeyFromAddress", () => {
  it("returns the scriptPubKey from an address", async () => {
    const address = "address";
    const scriptPubKey = "scriptPubKey";

    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey);
    const script = await getScriptPubKeyFromAddress(address);
    expect(script).toBe("scriptPubKey");
  });
});
