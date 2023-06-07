/* eslint-disable max-classes-per-file */
export class Address {
  create = jest.fn().mockReturnThis()

  scriptPubKey = jest.fn()
}

export const createMock = jest.fn().mockReturnThis()
export class Blockchain {
  create = createMock

  getHeight = jest.fn()

  getBlockHash = jest.fn()

  broadcast = jest.fn()

  estimateFee = jest.fn()
}
export class BumpFeeTxBuilder {
  create = jest.fn().mockReturnThis()

  allowShrinking = jest.fn()

  enableRbf = jest.fn()

  enableRbfWithSequence = jest.fn()

  finish = jest.fn()
}
export class DatabaseConfig {
  create = jest.fn().mockReturnThis()

  memory = jest.fn()

  sled = jest.fn()

  sqlite = jest.fn()
}
export class DerivationPath {
  create = jest.fn().mockReturnThis()
}
export class Descriptor {
  create = jest.fn().mockReturnThis()

  asString = jest.fn()

  asStringPrivate = jest.fn()

  newBip44 = jest.fn()

  newBip44Public = jest.fn()

  newBip49 = jest.fn()

  newBip49Public = jest.fn()

  newBip84 = jest.fn()

  newBip84Public = jest.fn()
}
export class DescriptorPublicKey {
  fromString = jest.fn()

  derive = jest.fn()

  extend = jest.fn()

  asString = jest.fn()
}
export class DescriptorSecretKey {
  create = jest.fn().mockReturnThis()

  derive = jest.fn()

  extend = jest.fn()

  asPublic = jest.fn()

  secretBytes = jest.fn()

  asString = jest.fn()
}
export class Mnemonic {
  create = jest.fn().mockReturnThis()

  fromString = jest.fn()

  fromEntropy = jest.fn()
}
export class PartiallySignedTransaction {
  combine = jest.fn()

  extractTx = jest.fn()

  serialize = jest.fn()

  txid = jest.fn()

  feeAmount = jest.fn()

  feeRate = jest.fn()
}
export class Transaction {
  _setTransaction = jest.fn()

  create = jest.fn().mockReturnThis()

  serialize = jest.fn()
}
export class TxBuilder {
  create = jest.fn().mockReturnThis()

  addRecipient = jest.fn()

  addUnspendable = jest.fn()

  addUtxo = jest.fn()

  addUtxos = jest.fn()

  doNotSpendChange = jest.fn()

  manuallySelectedOnly = jest.fn()

  onlySpendChange = jest.fn()

  unspendable = jest.fn()

  feeRate = jest.fn()

  feeAbsolute = jest.fn()

  drainWallet = jest.fn()

  drainTo = jest.fn()

  enableRbf = jest.fn()

  enableRbfWithSequence = jest.fn()

  addData = jest.fn()

  setRecipients = jest.fn()

  finish = jest.fn()
}
export class Wallet {
  create = jest.fn().mockReturnThis()

  getAddress = jest.fn()

  getBalance = jest.fn().mockResolvedValue({
    trustedPending: 0,
    untrustedPending: 0,
    confirmed: 0,
    spendable: 0,
    total: 0,
  })

  network = jest.fn()

  sync = jest.fn()

  listUnspent = jest.fn().mockResolvedValue([])

  listTransactions = jest.fn().mockResolvedValue([])

  sign = jest.fn()
}

export const mockBDKRN = () =>
  jest.mock('bdk-rn', () => ({
    Address,
    Blockchain,
    BumpFeeTxBuilder,
    DatabaseConfig,
    DerivationPath,
    Descriptor,
    DescriptorPublicKey,
    DescriptorSecretKey,
    Mnemonic,
    PartiallySignedTransaction,
    Transaction,
    TxBuilder,
    Wallet,
  }))
