import { networks } from "liquidjs-lib";
import {
  mempoolUTXO,
  utxo,
} from "../../../../tests/unit/data/liquidBlockExplorerData";
import { liquidAddresses } from "../../../../tests/unit/data/liquidNetworkData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getError } from "../../../../tests/unit/helpers/getError";
import { numberConverter } from "../../math/numberConverter";
import { PeachLiquidJSWallet } from "../PeachLiquidJSWallet";
import { clearPeachLiquidWallet, setLiquidWallet } from "../setWallet";
import { useLiquidWalletState } from "../useLiquidWalletState";
import { buildTransaction } from "./buildTransaction";
import { DUST_LIMIT } from "./constants";

describe("buildTransaction", () => {
  const props = {
    recipients: [{ address: liquidAddresses.regtest[0], amount: 100000 }],
    miningFees: 210,
    inputs: [utxo].map((u) => ({ ...u, derivationPath: "m/84'/1'/0'/0/0" })),
  };

  beforeEach(() => {
    useLiquidWalletState.getState().reset();
    const peachWallet = new PeachLiquidJSWallet({
      network: networks.regtest,
      wallet: createTestWallet(),
    });
    setLiquidWallet(peachWallet);
  });

  it("should throw an error if wallet is not ready", async () => {
    clearPeachLiquidWallet();
    const error = await getError<Error>(() => buildTransaction(props));
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("should throw if funds are insufficient", async () => {
    const error = await getError<Error>(() =>
      buildTransaction({
        ...props,
        recipients: [
          { address: liquidAddresses.regtest[0], amount: utxo.value + 1 },
        ],
      }),
    );
    expect(error.message).toBe(
      "InsufficientFunds: Insufficient funds: 200000 sat available of 200001 sat needed",
    );
  });
  it("should throw if amount below dust limit", async () => {
    const error = await getError<Error>(() =>
      buildTransaction({
        ...props,
        recipients: [
          { address: liquidAddresses.regtest[0], amount: DUST_LIMIT - 1 },
        ],
      }),
    );
    expect(error.message).toBe("BELOW_DUST_LIMIT");
  });
  it("returns finalized transaction with change", () => {
    const transaction = buildTransaction(props);
    expect(transaction.toHex()).toBe(
      "0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000185ce001600144b901a92dcae25c5644e596ddeea06759e6e46b70125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d2000000000000000002483045022100b8e30baecafd0bc3bbac2cb5367d68fb8107b05137637d3d4b1a8fc634b6baba0220462d2cb063f75cb40947b2ee8cf01aa72b161c623f52ac6919a9b29c546a117c012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000",
    );
    expect(transaction.ins).toHaveLength(1);

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      100000, 99790, 210,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "00144b901a92dcae25c5644e596ddeea06759e6e46b7",
      "",
    ]);
  });
  it("returns finalized transaction with multiple recipients", () => {
    const transaction = buildTransaction({
      ...props,
      recipients: liquidAddresses.regtest.map((address, i) => ({
        address,
        amount: 1000 * (i + 1),
      })),
    });
    expect(transaction.toHex()).toBe(
      "0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000060125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000003e8001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000007d0001976a9142b05d564e6a7a33c087f16e0f730d1440123799d88ac0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000000bb800220020914aec06ed3405dfbcc9494fb13169e8546fe89f31e6630cf0a4506db284055b0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000000fa00017a9144382bc8115ce44d91b3de0d21836c6f1ecc4f851870125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000002e55e001600144b901a92dcae25c5644e596ddeea06759e6e46b70125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d2000000000000000002483045022100b9188ff87525a31d368909cd86c6092689e7f80e636c6aacb34710971b10b9e10220012729c8c723b8d7056b2794acf2cdb87672ce9b5c9a90c6e6ffd4e0a261e017012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000000000000000",
    );
    expect(transaction.ins).toHaveLength(1);

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      1000, 2000, 3000, 4000, 189790, 210,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "76a9142b05d564e6a7a33c087f16e0f730d1440123799d88ac",
      "0020914aec06ed3405dfbcc9494fb13169e8546fe89f31e6630cf0a4506db284055b",
      "a9144382bc8115ce44d91b3de0d21836c6f1ecc4f85187",
      "00144b901a92dcae25c5644e596ddeea06759e6e46b7",
      "",
    ]);
  });
  it("returns finalized transaction with multiple inputs", () => {
    const transaction = buildTransaction({
      ...props,
      inputs: [utxo, mempoolUTXO].map((u) => ({
        ...u,
        derivationPath: "m/84'/1'/0'/0/0",
      })),
    });
    expect(transaction.toHex()).toBe(
      "0200000001022fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000258e1884be1a3c1daf7ead20f55f7de45006e773ee7b770fe4a51d3ff643550c000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000001fafe001600144b901a92dcae25c5644e596ddeea06759e6e46b70125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d2000000000000000002483045022100a78d9d9d42a2607abf4a6d8f3d6b065ac327105f93dd690a39fcf137b4b6e09f0220709b1d024af7486e0cc66282deedeafdaf7210d0ab4c3a450c3b56e7561be2cb012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f887540000000247304402200299e8c76fbd8d056a08b7a2dfcd8066c23194f995e1ca4352a1b1a4bcdbda42022014df474abc8152d0774328418cbc6162846017fe9c901bacd39d9884dfb5c521012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000",
    );
    expect(transaction.ins).toHaveLength(2);

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      100000, 129790, 210,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "00144b901a92dcae25c5644e596ddeea06759e6e46b7",
      "",
    ]);
  });
  it("returns finalized transaction without change if below the dust limit", () => {
    const transaction = buildTransaction({
      ...props,
      recipients: [
        {
          address: liquidAddresses.regtest[0],
          amount: utxo.value - DUST_LIMIT,
        },
      ],
    });
    expect(transaction.toHex()).toBe(
      "0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000020125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000030b0c001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000000023400000000000000000247304402205a8cb311639e52575a397eccb89c7285296bf078f9965cd735a70b774850714002201121ca13c39b19b98f50b601bef5c1fe3f04795e7c367f737715a5de29b8aa1e012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f887540000000000",
    );
    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      utxo.value - DUST_LIMIT,
      DUST_LIMIT,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "",
    ]);
  });
  it("returns finalized transaction without mining fees passed", () => {
    const transaction = buildTransaction({ ...props, miningFees: undefined });
    expect(transaction.toHex()).toBe(
      "0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000001869f001600144b901a92dcae25c5644e596ddeea06759e6e46b70125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000000001000000000000000002483045022100e881024257e2c85ba59e7de545b33626c866a721427c107528d4845b4d4e5678022023565f599460862c0ea973cf97553ad01a3809a302ae2a87334f34dfddaedccb012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000",
    );
  });
});
