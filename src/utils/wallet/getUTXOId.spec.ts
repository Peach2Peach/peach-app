import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { getUTXOId } from './getUTXOId'

describe('getUTXOId', () => {
  const vout = 1
  const outpoint = new OutPoint(confirmed1.txid, vout)
  const value = 10000
  const txOut = new TxOut(value, new Script('address'))
  const utxo1 = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)

  it('returns the id of a utxo', () => {
    expect(getUTXOId(utxo1)).toBe(`${confirmed1.txid}:${vout}`)
  })
})
