declare type TransactionType = 'TRADE' | 'ESCROWFUNDED' | 'REFUND' | 'WITHDRAWAL' | 'DEPOSIT'

declare type OfferData = {
  offerId?: string
  contractId?: string
  address: string
  amount: number
  price?: number
  currency?: Currency
}
declare type TransactionSummary = {
  id: string
  type: TransactionType
  offerData: OfferData[]
  amount: number
  date: Date
  height?: number
  confirmed: boolean
}
