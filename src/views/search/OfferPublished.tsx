import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const OfferPublished = () => {
  const { isSellOffer, shouldGoBack, offerId } = useRoute<'offerPublished'>().params
  const navigation = useNavigation()
  const goBackHome = () => navigation.replace(isSellOffer ? 'sell' : 'buy')
  const goToOffer = () => navigation.replace('search', { offerId })
  const goBack = () => navigation.goBack()

  return (
    <Overlay
      title={i18n('offer.published.title')}
      text={i18n('offer.published.description')}
      iconId="checkCircleInverted"
      buttons={
        <>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToOffer}>
            {i18n('showOffer')}
          </Button>
          <Button ghost onPress={shouldGoBack ? goBack : goBackHome}>
            {i18n('close')}
          </Button>
        </>
      }
    />
  )
}
