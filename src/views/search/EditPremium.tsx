import { useState } from 'react'
import { Header, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useMarketPrices, useNavigation, useRoute, useShowHelp } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { getOfferPrice, isSellOffer, offerIdToHex } from '../../utils/offer'
import { priceFormat } from '../../utils/string'
import { Premium } from '../sell/Premium'

export const EditPremium = () => {
  const { offerId } = useRoute<'editPremium'>().params
  const { offer } = useOfferDetails(offerId)
  const offerPremium = !!offer && 'premium' in offer ? offer.premium : undefined
  const [premium, setPremium] = useState(offerPremium)
  const displayPremium = premium ?? offerPremium ?? 0
  const { data: priceBook, isSuccess } = useMarketPrices()

  if (offer && !isSellOffer(offer)) {
    throw new Error('Offer is not a sell offer')
  }

  const displayCurrency = (Object.keys(offer?.meansOfPayment ?? {})[0] as Currency) ?? 'EUR'
  const currentPrice = offer && isSuccess ? getOfferPrice(offer?.amount, displayPremium, priceBook, displayCurrency) : 0

  return (
    <Screen header={<EditPremiumHeader />}>
      <Premium
        premium={displayPremium}
        setPremium={setPremium}
        amount={offer?.amount ?? 0}
        offerPrice={
          <Text style={tw`text-center text-black-2`}>
            ({i18n('sell.premium.currently', `${priceFormat(currentPrice)} ${displayCurrency}`)})
          </Text>
        }
        confirmButton={<ConfirmButton offerId={offerId} newPremium={displayPremium} />}
      />
    </Screen>
  )
}

function EditPremiumHeader () {
  const { offerId } = useRoute<'editPremium'>().params
  const showHelp = useShowHelp('premium')
  return <Header title={offerIdToHex(offerId)} icons={[{ ...headerIcons.help, onPress: showHelp }]} showPriceStats />
}

type Props = {
  offerId: string
  newPremium: number
}
function ConfirmButton ({ offerId, newPremium }: Props) {
  const { mutate: confirmPremium } = usePatchOffer(offerId, { premium: newPremium })
  const navigation = useNavigation()
  return (
    <Button onPress={() => confirmPremium(undefined, { onSuccess: navigation.goBack })} style={tw`self-center`}>
      {i18n('confirm')}
    </Button>
  )
}
