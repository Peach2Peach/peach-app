import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const genesisTx: TransactionDetails = {
  txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
  sent: 0,
  received: 5000000000,
  fee: 0,
  confirmationTime: { height: 0, timestamp: 1231006505 },
}

export const confirmed1: TransactionDetails = {
  txid: 'txid1',
  sent: 1,
  received: 1,
  fee: 1,
  confirmationTime: { height: 1, timestamp: 1 },
}
export const confirmed2: TransactionDetails = {
  txid: 'txid2',
  sent: 2,
  received: 2,
  fee: 2,
  confirmationTime: { height: 2, timestamp: 2 },
}
export const confirmed3: TransactionDetails = {
  txid: 'txid3',
  sent: 3,
  received: 3,
  fee: 3,
  confirmationTime: { height: 3, timestamp: 3 },
}
export const pending1: TransactionDetails = { txid: 'txid1', sent: 1000, received: 100, fee: 1 }
export const pending2: TransactionDetails = { txid: 'txid2', sent: 2000, received: 200, fee: 2 }
export const pending3: TransactionDetails = { txid: 'txid3', sent: 3000, received: 300, fee: 3 }

export const pendingTransactionSummary: TransactionSummary = {
  id: pending1.txid,
  type: 'TRADE',
  amount: 900,
  price: undefined,
  currency: undefined,
  date: new Date('2022-09-14T16:14:02.835Z'),
  confirmed: false,
  offerId: '123',
  contractId: undefined,
  height: undefined,
}
export const confirmedTransactionSummary: TransactionSummary = {
  ...pendingTransactionSummary,
  height: 1,
  confirmed: true,
}
export const bitcoinTransaction: Transaction = {
  txid: 'credacted',
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: 'bredacted',
      vout: 0,
      prevout: {
        scriptpubkey: '5120redacted',
        scriptpubkey_asm: 'OP_PUSHNUM_1 OP_PUSHBYTES_32 9a62redacted',
        scriptpubkey_type: 'v1_p2tr',
        scriptpubkey_address: 'bc1pnf32redacted',
        value: 223667,
      },
      scriptsig: '',
      scriptsig_asm: '',
      witness: ['0667redacted'],
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: '5120redacted',
      scriptpubkey_asm: 'OP_PUSHNUM_1 OP_PUSHBYTES_32 7ba2redacted',
      scriptpubkey_type: 'v1_p2tr',
      scriptpubkey_address: 'bc1p0w3vredacted',
      value: 173465,
    },
    {
      scriptpubkey: '0020redacted',
      scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_32 372dredacted',
      scriptpubkey_type: 'v0_p2wsh',
      scriptpubkey_address: 'bc1qxukhredacted',
      value: 50000,
    },
  ],
  size: 206,
  weight: 617,
  fee: 202,
  value: 223667,
  status: {
    confirmed: true,
    block_height: 756530,
    block_hash: 'redacted1680',
    block_time: 1664622712,
  },
}
