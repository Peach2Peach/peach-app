import { PeachScrollView, PrimaryButton, Screen } from '../../components'
import { SellOfferSummary } from '../../components/offer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'

export const SellSummary = () => {
  const { canPublish, publishOffer, isPublishing, offerDraft } = useSellSummarySetup()

  return (
    <Screen style={[tw`p-sm`, tw.md`p-md`]}>
      <PeachScrollView style={tw`mb-2`}>
        <SellOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        style={tw`self-center`}
        narrow
        onPress={canPublish ? publishOffer : undefined}
        disabled={!canPublish}
        loading={isPublishing}
      >
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
