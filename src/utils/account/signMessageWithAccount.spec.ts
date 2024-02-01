import { account1 } from "../../../tests/unit/data/accountData";
import { signMessageWithAccount } from "./signMessageWithAccount";

describe("signMessageWithAccount", () => {
  const message = "message";
  it("signs a message", () => {
    const signature = signMessageWithAccount(message, account1);
    expect(signature).toBe(
      "ec981ad5d8ae492722e9b0c09b3ae414c581ef14bbf8f8d25547a86e5bc242826d048322f5913d08b189aedf0d3cde2556e7aa90043c00615dacb56d4e2563ad",
    );
  });
});
