import { View } from 'react-native'
import { PeachScrollView, PrimaryButton } from '../../components'
import { BuyOfferSummary } from '../../components/offer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'

const getButtonTextId = (canPublish: boolean, isPublishing: boolean) => {
  if (isPublishing) return 'offer.publishing'
  if (canPublish) return 'offer.publish'
  return 'next'
}

export const BuySummary = () => {
  const { canPublish, publishOffer, isPublishing, goToMessageSigning, offerDraft } = useBuySummarySetup()

  return (
    <View style={[tw`justify-center flex-grow px-6 pb-5`, tw.md`px-8`]}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
        <BuyOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        testID="navigation-next"
        style={tw`self-center mt-4`}
        narrow={true}
        onPress={canPublish ? publishOffer : goToMessageSigning}
        loading={isPublishing}
      >
        {i18n(getButtonTextId(canPublish, isPublishing))}
      </PrimaryButton>
    </View>
  )
}
