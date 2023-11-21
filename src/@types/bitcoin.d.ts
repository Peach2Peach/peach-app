type Input = {
  txid: string
  vout: number
  prevout?: {
    scriptpubkey: string
    scriptpubkey_asm: string
    scriptpubkey_type: string
    scriptpubkey_address: string
    value: number
  }
  scriptsig: string
  scriptsig_asm: string
  inner_redeemscript_asm?: string
  witness?: string[]
  is_coinbase: boolean
  sequence: number
}

type Output = {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address: string
  value: number
}
type TransactionStatus = {
  confirmed: boolean
  block_height: number
  block_hash: string
  block_time: number
}

type Transaction = {
  txid: string
  version: number
  locktime: number
  vin: Input[]
  vout: Output[]
  size: number
  weight: number
  fee: number
  value?: number
  status: TransactionStatus
}

type UTXO = {
  txid: string
  vout: number
  value: number
  status: TransactionStatus
}
