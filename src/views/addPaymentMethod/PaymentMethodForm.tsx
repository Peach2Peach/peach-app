import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { PaymentMethodForms } from '../../components/inputs/paymentMethods/paymentForms'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { usePaymentMethodFormSetup } from './hooks/usePaymentMethodFormSetup'
import { specialTemplates } from './specialTemplates'
import { Fade } from '../../components/animation'
import { PrimaryButton } from '../../components/buttons'
import { PeachScrollView } from '../../components/PeachScrollView'
import { useSubmitForm } from '../../components/inputs/paymentMethods/paymentForms/hooks/useSubmitForm'
const { LinearGradient } = require('react-native-gradients')

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
  const keyboardOpen = useKeyboard()

  const Form = PaymentMethodForms[paymentMethod]?.component

  return (
    <View style={[tw`flex h-full`, specialTemplates[paymentMethod]?.style]}>
      <View style={!specialTemplates[paymentMethod] && tw`px-6`}>
        <View style={tw`h-full`}>
          <PeachScrollView
            contentContainerStyle={[tw`justify-center flex-grow`, !specialTemplates[paymentMethod] && tw`pt-4 pb-10`]}
          >
            {!!Form && (
              <Form onSubmit={submitForm} {...{ paymentMethod, data, currencies, setStepValid, setFormData }} />
            )}
          </PeachScrollView>
          <Fade show={!keyboardOpen} style={tw`items-center w-full mb-10`}>
            {!specialTemplates[paymentMethod] && (
              <View style={tw`w-full h-10 -mt-10`}>
                <LinearGradient colorList={whiteGradient} angle={90} />
              </View>
            )}
            <View style={tw`items-center flex-grow`}>
              <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={submitForm} narrow>
                {i18n('confirm')}
              </PrimaryButton>
            </View>
          </Fade>
        </View>
      </View>
    </View>
  )
}
