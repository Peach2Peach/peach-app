import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton } from '../../components'
import PaymentDetails from '../../components/payment/PaymentDetails'
import i18n from '../../utils/i18n'
import { useOfferDetailsSetup } from './hooks/useOfferDetailsSetup'
import { SellViewProps } from './SellPreferences'

export default ({ offerDraft, setOfferDraft, next }: SellViewProps): ReactElement => {
  const { paymentData, setMeansOfPayment, isEditing, isStepValid } = useOfferDetailsSetup({
    offerDraft,
    setOfferDraft,
  })

  return (
    <View style={tw`items-center flex-shrink h-full p-5 pb-7`}>
      <PeachScrollView style={[tw`flex-shrink h-full mb-10`]}>
        <PaymentDetails
          style={tw`mt-4`}
          paymentData={paymentData}
          setMeansOfPayment={setMeansOfPayment}
          editing={isEditing}
          origin="sellPreferences"
        />
      </PeachScrollView>
      <PrimaryButton testID="navigation-next" disabled={!isStepValid} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
