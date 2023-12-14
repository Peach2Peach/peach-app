import { useState } from 'react'
import { View } from 'react-native'
import { PremiumSlider, Screen, Text } from '../../components'
import { Header } from '../../components/Header'
import { PremiumInput } from '../../components/PremiumInput'
import { BTCAmount } from '../../components/bitcoin/btcAmount/BTCAmount'
import { Button } from '../../components/buttons/Button'
import { useMarketPrices, useNavigation, useRoute, useShowHelp } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer/usePatchOffer'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { getOfferPrice } from '../../utils/offer/getOfferPrice'
import { isSellOffer } from '../../utils/offer/isSellOffer'
import { offerIdToHex } from '../../utils/offer/offerIdToHex'
import { priceFormat } from '../../utils/string/priceFormat'
import { MarketInfo } from '../offerPreferences/components/MarketInfo'

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
      <MarketInfo type="buyOffers" meansOfPayment={offer?.meansOfPayment} premium={displayPremium} />
      <Premium
        premium={displayPremium}
        setPremium={setPremium}
        amount={offer?.amount ?? 0}
        offerPrice={
          <Text style={tw`text-center text-black-2`}>
            ({i18n('sell.premium.currently', `${priceFormat(currentPrice)} ${displayCurrency}`)})
          </Text>
        }
      />
      <ConfirmButton offerId={offerId} newPremium={displayPremium} />
    </Screen>
  )
}

function EditPremiumHeader () {
  const { offerId } = useRoute<'editPremium'>().params
  const showHelp = useShowHelp('premium')
  return <Header title={offerIdToHex(offerId)} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

type Props = {
  offerId: string
  newPremium: number
}
function ConfirmButton ({ offerId, newPremium }: Props) {
  const { mutate: confirmPremium } = usePatchOffer()
  const navigation = useNavigation()
  return (
    <Button
      onPress={() => confirmPremium({ offerId, newData: { premium: newPremium } }, { onSuccess: navigation.goBack })}
      style={tw`self-center`}
    >
      {i18n('confirm')}
    </Button>
  )
}

type PremiumProps = {
  premium: number
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void
  amount: number
  offerPrice: React.ReactNode
}

function Premium ({ premium, setPremium, amount, offerPrice }: PremiumProps) {
  return (
    <View style={tw`items-center justify-center grow gap-7`}>
      <View style={tw`items-center`}>
        <Text style={[tw`text-center h6`, tw`md:h5`]}>{i18n('sell.premium.title')}</Text>
        <View style={tw`flex-row items-center gap-1`}>
          <Text style={tw`text-center subtitle-1`}>{i18n('search.sellOffer')}</Text>
          <BTCAmount size="small" amount={amount} />
        </View>
      </View>
      <View style={tw`items-center gap-1`}>
        <PremiumInput premium={premium} setPremium={setPremium} />
        {offerPrice}
      </View>
      <PremiumSlider style={tw`items-center self-stretch gap-6px`} premium={premium} setPremium={setPremium} />
    </View>
  )
}
