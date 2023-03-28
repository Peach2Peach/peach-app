declare type DisputeReason =
  | 'noPayment.buyer'
  | 'noPayment.seller'
  | 'unresponsive.buyer'
  | 'unresponsive.seller'
  | 'abusive'
  | 'other'

declare type DisputeOutcome = 'buyerWins' | 'sellerWins' | 'none' | 'cancelTrade' | 'payOutBuyer'
declare type DisputeWinner = 'seller' | 'buyer' | null
