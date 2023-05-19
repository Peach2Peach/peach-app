import { View } from 'react-native'
import { RadialGradient } from '../../RadialGradient'
import { UnmatchButton } from '../buttons'
import { peachyGradient } from '../../../utils/layout'
import { Dispatch, SetStateAction } from 'react'
import tw from '../../../styles/tailwind'

type Props = {
  match: Match
  offer: BuyOffer
  interruptMatchFunction: () => void
  setShowMatchedCard: Dispatch<SetStateAction<boolean>>
}
export const MatchedOverlay = ({ match, offer, interruptMatchFunction, setShowMatchedCard }: Props) => (
  <>
    <View style={tw`absolute top-0 left-0 w-full h-full overflow-hidden opacity-75 rounded-t-xl`} pointerEvents="none">
      <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={peachyGradient} />
    </View>
    <View style={tw`absolute top-0 left-0 items-center justify-center w-full h-full`} pointerEvents="box-none">
      <UnmatchButton
        {...{ match, offer }}
        interruptMatching={interruptMatchFunction}
        showUnmatchedCard={() => setShowMatchedCard(false)}
      />
    </View>
  </>
)
