import { networks } from 'liquidjs-lib';
import { mempoolUTXO, utxo } from '../../../../tests/unit/data/liquidBlockExplorerData';
import { liquidAddresses } from '../../../../tests/unit/data/liquidNetworkData';
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet';
import { getError } from '../../../../tests/unit/helpers/getError';
import { numberConverter } from '../../math/numberConverter';
import { PeachLiquidJSWallet } from '../PeachLiquidJSWallet';
import { clearPeachLiquidWallet, setLiquidWallet } from '../setWallet';
import { useLiquidWalletState } from '../useLiquidWalletState';
import { buildTransaction } from './buildTransaction';
import { DUST_LIMIT } from './constants';


describe('buildTransaction', () => {
  const props = {
    recipient: liquidAddresses.regtest[0],
    amount: 100000,
    miningFees: 210,
    inputs: [utxo].map(u => ({ ...u, derivationPath: "m/84'/1'/0'/0/0" }))
  }

  beforeEach(()=> {
    useLiquidWalletState.getState().reset()
    const peachWallet = new PeachLiquidJSWallet({ network: networks.regtest, wallet: createTestWallet() });
    setLiquidWallet(peachWallet);
  })

  it('should throw an error if wallet is not ready', async () => {
    clearPeachLiquidWallet()
    const error = await getError<Error>(() => buildTransaction(props));
    expect(error.message).toBe("WALLET_NOT_READY");
  })
  it('should throw if funds are insufficient', async () => {
    const error = await getError<Error>(() => buildTransaction({
      ...props,
      amount: utxo.value + 1,
    }));
    expect(error.message).toBe("InsufficientFunds: Insufficient funds: 200000 sat available of 200001 sat needed");
  })
  it('should throw if amount below dust limit', async () => {
    const error = await getError<Error>(() => buildTransaction({ ...props, amount: DUST_LIMIT - 1 }));
    expect(error.message).toBe("BELOW_DUST_LIMIT");
  })
  it('returns finalized transaction with change', () => {
    const transaction = buildTransaction(props)
    expect(transaction.toHex()).toBe("0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000185ce001600145ad30b09cfe4ad7342bd60ea2cd4c360f8a7d24b0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d2000000000000000002473044022059272d22c15ceab20ac02b3f763265216e27be4382c6a3fe569c8c9fdb90480a02207329f8f4b263e2d368581c3470b542cac77528428524f2bab9e905707dd05305012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000");
    expect(transaction.ins).toHaveLength(1)

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map(o => numberConverter(o.value))).toEqual([100000, 99790, 210])
    expect(transaction.outs.map(o => o.script.toString('hex'))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "00145ad30b09cfe4ad7342bd60ea2cd4c360f8a7d24b",
      ""
    ])
  })
  it('returns finalized transaction with multiple inputs', () => {
    const transaction = buildTransaction({
      ...props,
      inputs: [utxo, mempoolUTXO].map(u => ({ ...u, derivationPath: "m/84'/1'/0'/0/0" }))
    })
    expect(transaction.toHex()).toBe("0200000001022fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000258e1884be1a3c1daf7ead20f55f7de45006e773ee7b770fe4a51d3ff643550c000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000001fafe0016001449cedbd7a744c9fc64d051f014c928a922d04da40125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d200000000000000000247304402202473bb9058218f5587bdfdddfa46d84e17736f6891aa2debf9ea1abc0f055210022064227f39574eb6d1ce2688d32e46cb38dfc52ca88ddb2dcc93c8922fb8b117f5012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f887540000000248304502210087cbd6dc076252c6d87e3a80bb40a1b506794561eabb7835c94c96f328e6b11d022031cb361d906d7b663ba43d6be0e709510391451c3e109358eab1c50be00b1ecf012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000");
    expect(transaction.ins).toHaveLength(2)

    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map(o => numberConverter(o.value))).toEqual([100000, 129790, 210])
    expect(transaction.outs.map(o => o.script.toString('hex'))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      "001449cedbd7a744c9fc64d051f014c928a922d04da4",
      ""
    ])
  })
  it('returns finalized transaction without change if below the dust limit', () => {
    const transaction = buildTransaction({
      ...props,
      amount: utxo.value - DUST_LIMIT,
    })
    expect(transaction.toHex()).toBe("0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000020125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000030b0c001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000000023400000000000000000247304402205a8cb311639e52575a397eccb89c7285296bf078f9965cd735a70b774850714002201121ca13c39b19b98f50b601bef5c1fe3f04795e7c367f737715a5de29b8aa1e012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f887540000000000");
    // eslint-disable-next-line no-magic-numbers
    expect(transaction.outs.map(o => numberConverter(o.value))).toEqual([utxo.value - DUST_LIMIT, 564])
    expect(transaction.outs.map(o => o.script.toString('hex'))).toEqual([
      "00142b05d564e6a7a33c087f16e0f730d1440123799d",
      ""
    ])
  })
  it('returns finalized transaction without mining fees passed', () => {
    const transaction = buildTransaction({ ...props, miningFees: undefined})
    expect(transaction.toHex()).toBe("0200000001012fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000186a0001600142b05d564e6a7a33c087f16e0f730d1440123799d0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000001869f00160014633d8f5dc848fca74b7c98b5ddcadfe17ef4be370125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a01000000000000000100000000000000000247304402205161bc6ff7c8b129391e8f32b46599b5b64b70ad207d4b10021da78cf4a905500220077eb31f83a2cf2b60a719469176e100a1389dda11beab91f42a0f0c90e3f357012102addaf26f93440ddeacb7c2eb618d28f3abfa56e536532df26240c0c2c0f8875400000000000000");
  })
})