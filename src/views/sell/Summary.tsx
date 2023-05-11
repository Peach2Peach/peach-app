import { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { PeachScrollView, PrimaryButton } from '../../components'
import { SellOfferSummary } from '../../components/offer'
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
    <PeachScrollView contentContainerStyle={[tw`items-center justify-center flex-grow px-6 pb-5`, tw.md`px-8`]}>
      <View style={tw`justify-center flex-grow`}>
        <SellOfferSummary offer={offerDraft} />
      </View>
      <PrimaryButton
        style={tw`self-center mt-4`}
        testID="navigation-next"
        narrow={!canPublish}
        onPress={canPublish ? publishSellOffer : goToSetupRefundWallet}
        loading={isPublishing}
      >
        {i18n('next')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
