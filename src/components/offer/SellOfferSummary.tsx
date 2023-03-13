import { NETWORK } from '@env'
import React, { ReactElement, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import shallow from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Icon from '../Icon'
import { PaymentMethod } from '../matches/PaymentMethod'
import { getPremiumColor } from '../matches/utils'
import { TabbedNavigation } from '../navigation/TabbedNavigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { getSummaryWalletLabel } from '../../utils/offer'

type SellOfferSummaryProps = ComponentProps & {
  offer: SellOffer | SellOfferDraft
}

const isSellOfferWithDefinedEscrow = (offer: SellOffer | SellOfferDraft): offer is SellOffer & { escrow: string } =>
  'escrow' in offer && !!offer.escrow

export const SellOfferSummary = ({ offer, style }: SellOfferSummaryProps): ReactElement => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [walletLabel, setWalletLabel] = useState(i18n('loading'))

  useEffect(() => {
    ;(async () => {
      setWalletLabel(
        getSummaryWalletLabel({
          offerWalletLabel: offer.walletLabel,
          address: offer.returnAddress,
          customPayoutAddress: payoutAddress,
          customPayoutAddressLabel: payoutAddressLabel,
        }) || i18n('offer.summary.customPayoutAddress'),
      )
    })()
  }, [offer.returnAddress, offer.walletLabel, payoutAddress, payoutAddressLabel])

  return (
    <View style={[tw`border border-black-5 rounded-2xl p-7 bg-primary-background-light`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>
        {i18n(`offer.summary.${offer.tradeStatus !== 'offerCanceled' ? 'youAreSelling' : 'youWereSelling'}`)}
      </Text>
      <SatsFormat
        sats={offer.amount}
        containerStyle={tw`self-center`}
        bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`font-normal body-s`}
      />
      <HorizontalLine style={tw`w-64 my-4`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withA')}</Text>
      <Text style={[tw`text-center subtitle-1`, getPremiumColor(offer.premium, false)]}>
        <Text style={tw`subtitle-1`}>{Math.abs(offer.premium)}% </Text>
        {i18n(offer.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount')}
      </Text>
      <HorizontalLine style={tw`w-64 my-4`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`flex-row flex-wrap items-center justify-center mt-3 mb-2`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`sellOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>

      <HorizontalLine style={tw`w-64 my-4`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.refundWallet')}</Text>
      <Text style={tw`self-center subtitle-1`}>{walletLabel}</Text>

      {isSellOfferWithDefinedEscrow(offer) && (
        <>
          <HorizontalLine style={tw`w-64 my-4`} />
          <TouchableOpacity
            style={tw`flex-row items-end self-center`}
            onPress={() => showAddress(offer.escrow, NETWORK)}
          >
            <Text style={tw`underline tooltip text-black-2`}>{i18n('escrow.viewInExplorer')}</Text>
            <Icon
              id="externalLink"
              style={tw`w-[18px] h-[18px] ml-[2px] mb-[2px]`}
              color={tw`text-primary-main`.color}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
