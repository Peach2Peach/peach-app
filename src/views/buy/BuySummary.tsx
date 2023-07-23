import { PeachScrollView, PrimaryButton, Screen } from '../../components'
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
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
        <BuyOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        style={tw`self-center mb-5`}
        narrow
        onPress={canPublish ? publishOffer : goToMessageSigning}
        loading={isPublishing}
      >
        {i18n(getButtonTextId(canPublish, isPublishing))}
      </PrimaryButton>
    </Screen>
  )
}
