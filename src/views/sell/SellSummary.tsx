import { PeachScrollView, PrimaryButton, Screen } from '../../components'
import { SellOfferSummary } from '../../components/offer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'

export const SellSummary = () => {
  const { canPublish, publishOffer, isPublishing, offerDraft } = useSellSummarySetup()

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-sm`, tw.md`py-md`]}>
        <SellOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        style={tw`self-center mt-2 mb-5 `}
        narrow
        onPress={canPublish ? publishOffer : undefined}
        loading={isPublishing}
      >
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
