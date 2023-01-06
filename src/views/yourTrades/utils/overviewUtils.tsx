import tw from '../../../styles/tailwind'

export const isPastOffer = (offer: SellOffer | BuyOffer) =>
  /tradeCompleted|tradeCanceled|offerCanceled/u.test(offer.tradeStatus)

export const isOpenOffer = (offer: SellOffer | BuyOffer) => !isPastOffer(offer)

export const isOpenAction = (offer: SellOffer | BuyOffer) =>
  /fundEscrow|hasMatchesAvailable|rateUser/u.test(offer.tradeStatus)
  || (offer.tradeStatus === 'confirmPaymentRequired' && offer.type === 'ask')
  || (offer.tradeStatus === 'paymentRequired' && offer.type === 'bid')
export const isWaiting = (offer: SellOffer | BuyOffer) =>
  /escrowWaitingForConfirmation|searchingForPeer/u.test(offer.tradeStatus)
  || (offer.tradeStatus === 'paymentRequired' && offer.type === 'ask')
  || (offer.tradeStatus === 'confirmPaymentRequired' && offer.type === 'bid')
export const isPrioritary = (offer: SellOffer | BuyOffer) =>
  /dispute|confirmCancelation|refundTxSignatureRequired/u.test(offer.tradeStatus)

export const getOfferLevel = (offer: SellOffer | BuyOffer) => {
  if (isPrioritary(offer)) return 'WARN'
  else if (isWaiting(offer)) return 'WAITING'
  return 'APP'
}

export const getThemePastOffer = (offer: SellOffer | BuyOffer, contract?: Contract | null) => {
  if (
    (!!contract?.disputeWinner && contract?.disputeWinner === 'seller' && offer.type === 'bid')
    || (contract?.disputeWinner === 'buyer' && offer.type === 'ask')
  ) {
    return {
      icon: 'alertOctagon',
      level: 'WARN',
      color: tw`bg-warning-main`.color,
    }
  } else if (offer.tradeStatus === 'offerCanceled' || offer.tradeStatus === 'tradeCanceled') {
    return {
      icon: 'xCircle',
      level: 'DEFAULT',
      color: tw`bg-black-2`.color,
    }
  } else if (offer.tradeStatus === 'tradeCompleted' && offer.type === 'ask') {
    return { icon: 'sell', level: 'APP', color: tw`bg-primary-main`.color }
  }
  return {
    icon: 'buy',
    level: 'SUCCESS',
    color: tw`bg-success-background`.color,
  }
}

export const statusIcons = {
  fundEscrow: 'downloadCloud',
  searchingForPeer: 'search',
  escrowWaitingForConfirmation: 'clock',
  hasMatchesAvailable: 'checkCircle',
  refundTxSignatureRequired: '', // TODO Ask Lab
  paymentRequired: 'dollarSign',
  confirmPaymentRequired: 'dollarSign',
  dispute: 'alertOctagon',
  rateUser: 'heart',
  confirmCancelation: 'xCircle',
  offerCanceled: '',
  tradeCanceled: '',
  tradeCompleted: '',
}
