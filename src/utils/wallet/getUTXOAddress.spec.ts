import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind, Network } from 'bdk-rn/lib/lib/enums'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { getUTXOAddress } from './getUTXOAddress'
import { addressFromScriptMock } from '../../../tests/unit/mocks/bdkRN'
import { Address } from 'bdk-rn'

describe('getUTXOAddress', () => {
  const address = 'address'
  const vout = 1
  const outpoint = new OutPoint(confirmed1.txid, vout)
  const txOut = new TxOut(10000, new Script(address))
  const utxo1 = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)

  const addressObject = new Address()
  addressObject.asString = jest.fn().mockResolvedValue(address)

  it('returns the address of a UTXO', async () => {
    addressFromScriptMock.mockResolvedValue(addressObject)
    expect(await getUTXOAddress(Network.Regtest)(utxo1)).toBe(address)
  })
})
