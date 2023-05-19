import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { PaymentMethodForms } from '.'
import { useKeyboard } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
import { specialTemplates } from '../../../../views/addPaymentMethod/specialTemplates'
import { Fade } from '../../../animation'
import { PrimaryButton } from '../../../buttons'
import { PeachScrollView } from '../../../PeachScrollView'
import { useSubmitForm } from './hooks/useSubmitForm'
const { LinearGradient } = require('react-native-gradients')

type PaymentMethodFormProps = ComponentProps & {
  paymentMethod: PaymentMethod
  data: Partial<PaymentData>
  currencies?: Currency[]
  onSubmit: (data: PaymentData) => void
}
export type FormProps = {
  data: Partial<PaymentData>
  currencies: Currency[]
  onSubmit: (data: PaymentData) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
  paymentMethod: PaymentMethod
  setFormData: Dispatch<SetStateAction<PaymentData | undefined>>
}

export const PaymentMethodForm = ({ paymentMethod, data, currencies = [], onSubmit, style }: PaymentMethodFormProps) => {
  const { stepValid, setStepValid, setFormData, submitForm } = useSubmitForm<PaymentData>(onSubmit)
  const keyboardOpen = useKeyboard()

  const Form = PaymentMethodForms[paymentMethod]?.component

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView
        contentContainerStyle={[tw`justify-center flex-grow`, !specialTemplates[paymentMethod] && tw`pt-4 pb-10`]}
      >
        {!!Form && <Form onSubmit={submitForm} {...{ paymentMethod, data, currencies, setStepValid, setFormData }} />}
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
  )
}
