import { useState } from 'react'
import { PrimaryButton, Text } from '../../components'
import { useHeaderSetup, useMarketPrices, useRoute, useShowHelp } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { getOfferPrice, isSellOffer, offerIdToHex } from '../../utils/offer'
import { priceFormat } from '../../utils/string'
import { Premium } from '../sell/Premium'

export const EditPremium = () => {
  const { offerId } = useRoute<'editPremium'>().params
  const showHelp = useShowHelp('premium')
  useHeaderSetup({ title: offerIdToHex(offerId), icons: [{ ...headerIcons.help, onPress: showHelp }] })
  const { offer } = useOfferDetails(offerId)
  const [premium, setPremium] = useState(offer?.premium)
  const displayPremium = premium ?? offer?.premium ?? 0
  const { data: priceBook, isSuccess } = useMarketPrices()

  if (offer && !isSellOffer(offer)) {
    throw new Error('Offer is not a sell offer')
  }

  const displayCurrency = (Object.keys(offer?.meansOfPayment ?? {})[0] as Currency) ?? 'EUR'

  const currentPrice = offer && isSuccess ? getOfferPrice(offer?.amount, displayPremium, priceBook, displayCurrency) : 0

  return (
    <Premium
      premium={displayPremium}
      setPremium={setPremium}
      amount={offer?.amount ?? 0}
      offerPrice={
        <Text style={tw`text-center text-black-2`}>
          ({i18n('sell.premium.currently', `${priceFormat(currentPrice)} ${displayCurrency}`)})
        </Text>
      }
      // TODO: add proper button
      confirmButton={<PrimaryButton>Confirm</PrimaryButton>}
    />
  )
}
