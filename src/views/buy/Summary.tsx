import { useEffect } from 'react'
import { View } from 'react-native'
import { PeachScrollView, PrimaryButton } from '../../components'
import { BuyOfferSummary } from '../../components/offer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BuyViewProps } from './BuyPreferences'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'

const getButtonTextId = (canPublish: boolean, isPublishing: boolean) => {
  if (isPublishing) return 'offer.publishing'
  if (canPublish) return 'offer.publish'
  return 'next'
}

export default ({ offerDraft, setOfferDraft }: BuyViewProps) => {
  const {
    peachWalletActive,
    releaseAddress,
    walletLabel,
    message,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToMessageSigning,
  } = useBuySummarySetup()
  const publishBuyOffer = () => publishOffer(offerDraft)

  useEffect(() => {
    if (releaseAddress) setOfferDraft((prev) => ({
      ...prev,
      releaseAddress,
      message,
      messageSignature,
    }))
  }, [releaseAddress, message, messageSignature, setOfferDraft])

  useEffect(() => {
    if (walletLabel) setOfferDraft((prev) => ({
      ...prev,
      walletLabel,
    }))
  }, [walletLabel, setOfferDraft])

  return (
    <View style={[tw`justify-center flex-grow px-6 pb-5`, tw.md`px-8`]}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
        <BuyOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        testID="navigation-next"
        style={tw`self-center mt-4`}
        narrow={true}
        disabled={peachWalletActive && !messageSignature}
        onPress={canPublish ? publishBuyOffer : goToMessageSigning}
        loading={isPublishing}
      >
        {i18n(getButtonTextId(canPublish, isPublishing))}
      </PrimaryButton>
    </View>
  )
}
