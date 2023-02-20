import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { BuyOfferSummary, PrimaryButton } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BuyViewProps } from './BuyPreferences'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'

export default ({ offer, updateOffer }: BuyViewProps): ReactElement => {
  const {
    releaseAddress,
    walletLabel,
    message,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToSetupPayoutWallet,
  } = useBuySummarySetup()
  const publishBuyOffer = () => publishOffer(offer)

  useEffect(() => {
    if (releaseAddress) updateOffer({
      ...offer,
      releaseAddress,
      message,
      messageSignature,
    })
  }, [releaseAddress, message, messageSignature, updateOffer])

  useEffect(() => {
    if (walletLabel) updateOffer({
      ...offer,
      walletLabel,
    })
  }, [walletLabel, updateOffer])

  return (
    <View style={tw`items-center flex-shrink h-full px-8 pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <BuyOfferSummary offer={offer} />
      </View>
      <PrimaryButton
        testID="navigation-next"
        narrow={!canPublish}
        onPress={canPublish ? publishBuyOffer : goToSetupPayoutWallet}
        iconId={canPublish ? 'uploadCloud' : undefined}
        loading={isPublishing}
      >
        {i18n(canPublish ? 'offer.publish' : 'next')}
      </PrimaryButton>
    </View>
  )
}
