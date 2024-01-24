import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind, Network } from 'bdk-rn/lib/lib/enums'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { getUTXOAddress } from './getUTXOAddress'

describe('getUTXOAddress', () => {
  const address = 'address'
  const vout = 1
  const outpoint = new OutPoint(confirmed1.txid, vout)
  const value = 10000
  const txOut = new TxOut(value, new Script(address))
  const utxo1 = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)

  it('returns the address of a UTXO', async () => {
    expect(await getUTXOAddress(Network.Regtest)(utxo1)).toBe(address)
  })
})
