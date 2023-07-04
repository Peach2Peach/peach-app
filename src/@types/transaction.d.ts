declare type TransactionType = 'TRADE' | 'ESCROWFUNDED' | 'REFUND' | 'WITHDRAWAL' | 'DEPOSIT'
declare type TransactionSummary = {
  id: string
  contractId?: string
  offerId?: string
  type: TransactionType
  amount: number
  price?: number
  currency?: Currency
  date: Date
  height?: number
  confirmed: boolean
}
