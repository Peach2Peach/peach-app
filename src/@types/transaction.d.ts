declare type TransactionType = 'TRADE' | 'REFUND' | 'WITHDRAWAL' | 'DEPOSIT'
declare type TransactionSummary = {
  id: string
  offerId?: string
  type: TransactionType
  amount: number
  price: number
  currency: Currency
  date: Date
  confirmed: boolean
}
