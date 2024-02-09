import tw from "../../../styles/tailwind";

export const options = {
  missingSelection: {
    text: "search.matchButton.matchOffer",
    iconId: "plusSquare",
    backgroundColor: tw`bg-primary-mild-1`,
  },
  tradingLimitReached: {
    text: "search.matchButton.tradingLimitReached",
    iconId: "pauseCircle",
    backgroundColor: tw`bg-black-50`,
  },
  matchOffer: {
    text: "search.matchButton.matchOffer",
    iconId: "plusSquare",
    backgroundColor: tw`bg-primary-main`,
  },
  acceptMatch: {
    text: "search.matchButton.acceptMatch",
    iconId: "checkSquare",
    backgroundColor: tw`bg-primary-main`,
  },
  offerMatched: {
    text: "search.matchButton.offerMatched",
    iconId: "checkSquare",
    backgroundColor: tw`bg-gradient-red`,
  },
} as const;
