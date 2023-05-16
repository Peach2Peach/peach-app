import tw from '../../styles/tailwind'

export const getTradeSeparatorIconColor = (view: ContractViewer, disputeWinner?: Contract['disputeWinner']) => {
  if (view === disputeWinner) {
    return tw`text-success-main`.color
  }
  if (disputeWinner) {
    return tw`text-error-main`.color
  }
  return tw`text-black-2`.color
}
