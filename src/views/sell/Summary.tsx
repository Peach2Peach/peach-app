import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { PeachScrollView, PrimaryButton, SellOfferSummary } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'
import { SellViewProps } from './SellPreferences'

export default ({ offer, updateOffer }: SellViewProps): ReactElement => {
  const { returnAddress, walletLabel, goToSetupRefundWallet, canPublish, publishOffer, isPublishing }
    = useSellSummarySetup()
  const publishSellOffer = () => publishOffer(offer)

  useEffect(() => {
    if (returnAddress) updateOffer({
      ...offer,
      returnAddress,
    })
  }, [returnAddress, updateOffer])

  useEffect(() => {
    if (walletLabel) updateOffer({
      ...offer,
      walletLabel,
    })
  }, [walletLabel, updateOffer])

  return (
    <PeachScrollView contentContainerStyle={tw`items-center flex-grow px-8 pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <SellOfferSummary offer={offer} />
      </View>
      <PrimaryButton
        testID="navigation-next"
        narrow={!canPublish}
        onPress={canPublish ? publishSellOffer : goToSetupRefundWallet}
        iconId={canPublish ? 'uploadCloud' : undefined}
        loading={isPublishing}
      >
        {i18n(canPublish ? 'offer.publish' : 'next')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
