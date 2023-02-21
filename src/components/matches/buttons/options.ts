import tw from '../../../styles/tailwind'

export const options = {
  missingSelection: {
    iconId: 'plusSquare',
    backgroundColor: tw`bg-primary-mild-1`,
    borderColor: tw`border-primary-mild-1`,
    text: 'search.matchButton.matchOffer',
  },
  tradingLimitReached: {
    iconId: 'pauseCircle',
    backgroundColor: tw`bg-black-3`,
    borderColor: tw`border-black-3`,
    text: 'search.matchButton.tradingLimitReached',
  },
  matchOffer: {
    iconId: 'plusSquare',
    backgroundColor: tw`bg-primary-main`,
    borderColor: tw`border-primary-main`,
    text: 'search.matchButton.matchOffer',
  },
  acceptMatch: {
    iconId: 'checkSquare',
    backgroundColor: tw`bg-primary-main`,
    borderColor: tw`border-primary-main`,
    text: 'search.matchButton.acceptMatch',
  },
  offerMatched: {
    iconId: 'checkSquare',
    backgroundColor: tw`bg-gradient-red`,
    borderColor: tw`border-primary-main`,
    text: 'search.matchButton.offerMatched',
  },
} as const
