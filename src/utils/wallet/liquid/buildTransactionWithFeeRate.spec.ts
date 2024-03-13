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
import { buildTransactionWithFeeRate } from "./buildTransactionWithFeeRate";
import { DUST_LIMIT } from "./constants";

describe("buildTransactionWithFeeRate", () => {
  const props = {
    recipients: [{ address: liquidAddresses.regtest[0], amount: 100000 }],
    feeRate: 1,
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
    const error = await getError<Error>(() =>
      buildTransactionWithFeeRate(props),
    );
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("should throw if funds are insufficient", async () => {
    const error = await getError<Error>(() =>
      buildTransactionWithFeeRate({
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
      buildTransactionWithFeeRate({
        ...props,
        recipients: [
          { address: liquidAddresses.regtest[0], amount: DUST_LIMIT - 1 },
        ],
      }),
    );
    expect(error.message).toBe("BELOW_DUST_LIMIT");
  });
  it("returns finalized transaction with change", () => {
    const transaction = buildTransactionWithFeeRate(props);
    expect(transaction.toHex()).toBe(
      "0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000018594001600149b82b284d10787de9cc4b19139e8c9e482fd917f0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000000010c000000000000000002483045022100c1facbd79185b01ca55b7a9d40845f047ab3f568d019dcb20acc34ff68ddbc1002200dd562b463c4c4c8e895a3bfbc2673c3bef097ee2138d4d57863280b271ad669012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000",
    );
    expect(transaction.ins).toHaveLength(1);

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      100000, 99732, 268,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "00149b82b284d10787de9cc4b19139e8c9e482fd917f",
      "",
    ]);
  });
  it("returns finalized transaction with multiple inputs", () => {
    const transaction = buildTransactionWithFeeRate({
      ...props,
      inputs: [utxo, mempoolUTXO].map((u) => ({
        ...u,
        derivationPath: "m/84'/1'/0'/0/0",
      })),
    });
    expect(transaction.toHex()).toBe(
      "0200000001022fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000258e1884be1a3c1daf7ead20f55f7de45006e773ee7b770fe4a51d3ff643550c000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000001fa80001600149b82b284d10787de9cc4b19139e8c9e482fd917f0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000000150000000000000000002473044022070f04089f9e71417a785a3b1d9e8ced9b522dbfa069caca1a6357bca7c2017d802205ce76addb0f148a58ec083e72ad6731ea95c65c9e14141e90eecd4a48e1fada7012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f887540000000247304402207d790391a113857c5b772be57d9cb44d756558044a192d1ca133680d24fe313e022079c021fb678c8652c317b9ea2f16b3c8373d5e58207d93331b7bac9df0dafdf7012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000",
    );
    expect(transaction.ins).toHaveLength(2);

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map((o) => numberConverter(o.value))).toEqual([
      100000, 129664, 336,
    ]);
    expect(transaction.outs.map((o) => o.script.toString("hex"))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "00149b82b284d10787de9cc4b19139e8c9e482fd917f",
      "",
    ]);
  });
  it("returns finalized transaction without change if below the dust limit", () => {
    const transaction = buildTransactionWithFeeRate({
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
});
