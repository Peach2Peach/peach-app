import { networks } from "bitcoinjs-lib";
import { createRandomWallet } from "./createRandomWallet";
import { getNetwork } from "./getNetwork";

describe("createRandomWallet", () => {
  it("creates a random new wallet", async () => {
    const network = getNetwork();
    const [wallet1, wallet2] = await Promise.all([
      createRandomWallet(network),
      createRandomWallet(network),
    ]);

    expect(typeof wallet1.mnemonic).toBe("string");
    expect(wallet1.wallet.network).toStrictEqual(networks.regtest);
    expect(wallet1.mnemonic).not.toBe(wallet2.mnemonic);
    expect(wallet1.wallet.publicKey.toString("hex")).not.toBe(
      wallet2.wallet.publicKey.toString("hex"),
    );
  });
});
