import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { PaymentMethodForms } from '../../components/inputs/paymentMethods/paymentForms'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { usePaymentMethodFormSetup } from './hooks/usePaymentMethodFormSetup'
import { PrimaryButton } from '../../components/buttons'
import { PeachScrollView } from '../../components/PeachScrollView'
import { useSubmitForm } from '../../components/inputs/paymentMethods/paymentForms/hooks/useSubmitForm'

export type FormProps = {
  data: Partial<PaymentData>
  currencies: Currency[]
  onSubmit: (data: PaymentData) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
  paymentMethod: PaymentMethod
  setFormData: Dispatch<SetStateAction<PaymentData | undefined>>
}

export const PaymentMethodForm = () => {
  const { paymentMethod, data, currencies = [], onSubmit } = usePaymentMethodFormSetup()
  const { stepValid, setStepValid, setFormData, submitForm } = useSubmitForm<PaymentData>(onSubmit)

  const Form = PaymentMethodForms[paymentMethod]?.component

  return (
    <PeachScrollView contentContainerStyle={tw`flex-grow`} contentStyle={[tw`flex-grow px-4`, tw.md`px-8`]}>
      <View style={tw`justify-center flex-grow`}>
        {!!Form && <Form onSubmit={submitForm} {...{ paymentMethod, data, currencies, setStepValid, setFormData }} />}
      </View>
      <PrimaryButton style={tw`self-center mb-5`} disabled={!stepValid} onPress={submitForm} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
