import { LocalUtxo } from 'bdk-rn/lib/classes/Bindings'

export const getUTXOId = (utxo: LocalUtxo) => [utxo.outpoint.txid, utxo.outpoint.vout].join(':')
