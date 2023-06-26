export const levelMap: Record<TransactionType, Level> = {
  TRADE: 'SUCCESS',
  WITHDRAWAL: 'APP',
  ESCROWFUNDED: 'APP',
  DEPOSIT: 'DEFAULT',
  REFUND: 'DEFAULT',
}
