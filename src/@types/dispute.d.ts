type DisputeReason =
  | 'noPayment.buyer'
  | 'noPayment.seller'
  | 'unresponsive.buyer'
  | 'unresponsive.seller'
  | 'abusive'
  | 'other'

type DisputeOutcome = 'buyerWins' | 'sellerWins' | 'none' | 'cancelTrade' | 'payOutBuyer'
type DisputeWinner = 'seller' | 'buyer'
