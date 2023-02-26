import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { PrimaryButton, SellOfferSummary } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'
import { SellViewProps } from './SellPreferences'

export default ({ offerDraft, setOfferDraft }: SellViewProps): ReactElement => {
  const { returnAddress, walletLabel, goToSetupRefundWallet, canPublish, publishOffer, isPublishing }
    = useSellSummarySetup()
  const publishSellOffer = () => publishOffer(offerDraft)

  useEffect(() => {
    if (returnAddress) setOfferDraft((prev) => ({
      ...prev,
      returnAddress,
    }))
  }, [returnAddress, setOfferDraft])

  useEffect(() => {
    if (walletLabel) setOfferDraft((prev) => ({
      ...prev,
      walletLabel,
    }))
  }, [walletLabel, setOfferDraft])

  return (
    <View style={tw`items-center flex-shrink h-full px-8 pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <SellOfferSummary offer={offerDraft} />
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
    </View>
  )
}
