import { View } from 'react-native'
import { ParsedPeachText } from '../../../components'
import { useRoute } from '../../../hooks'
import { useIsMediumScreen } from '../../../hooks/useIsMediumScreen'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isSellOffer } from '../../../utils/offer'
import { useOfferMatches } from '../hooks/useOfferMatches'
import { MatchInformation } from './MatchInformation'
import { SellOfferTitle } from './SellOfferTitle'

type Props = {
  offer: BuyOffer | SellOffer
}
export const MatchesTitle = ({ offer }: Props) => {
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  const isMediumScreen = useIsMediumScreen()

  return (
    <View>
      {isSellOffer(offer) && (
        <>
          <SellOfferTitle plural={matches.length > 1} />
          <MatchInformation offer={offer} style={tw.md`mt-5`} />
        </>
      )}
      {isMediumScreen && !isSellOffer(offer) && (
        <ParsedPeachText
          style={tw`text-center h5`}
          parse={[
            {
              pattern: new RegExp(i18n('search.selectYourMatches.highlight'), 'u'),
              style: tw`text-primary-main`,
            },
          ]}
        >
          {i18n('search.selectYourMatches')}
        </ParsedPeachText>
      )}
    </View>
  )
}
