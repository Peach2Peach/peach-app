import { ReactElement, useRef } from 'react';
import * as React from 'react';
import { View } from 'react-native'
import { PaymentMethodForms } from '.'
import { useKeyboard } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
import { specialTemplates } from '../../../../views/addPaymentMethod/specialTemplates'
import { Fade } from '../../../animation'
import { PrimaryButton } from '../../../buttons'
import PeachScrollView from '../../../PeachScrollView'
import { usePaymentMethodFormSetup } from './hooks/usePaymentMethodFormSetup'
const { LinearGradient } = require('react-native-gradients')

type FormRef = {
  save: () => void
}

export type PaymentMethodFormProps = ComponentProps & {
  paymentMethod: PaymentMethod
  data: Partial<PaymentData>
  currencies?: Currency[]
  onSubmit: (data: PaymentData) => void
  onDelete?: () => void
}
export type FormProps = PaymentMethodFormProps & { setStepValid: React.Dispatch<React.SetStateAction<boolean>> }

export const PaymentMethodForm = ({
  paymentMethod,
  data,
  currencies = [],
  onSubmit,
  style,
}: PaymentMethodFormProps): ReactElement => {
  const { submit, stepValid, setStepValid } = usePaymentMethodFormSetup(onSubmit)
  const keyboardOpen = useKeyboard()

  const Form = PaymentMethodForms[paymentMethod]!
  let $formRef = useRef<FormRef>(null).current

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView
        contentContainerStyle={[
          tw`items-center justify-center flex-grow`,
          !specialTemplates[paymentMethod] ? tw`pt-4 pb-10` : {},
        ]}
      >
        <Form
          forwardRef={(r: FormRef) => ($formRef = r)}
          onSubmit={submit}
          {...{ paymentMethod, data, currencies, setStepValid }}
        />
      </PeachScrollView>
      <Fade show={!keyboardOpen} style={tw`items-center w-full mb-10 `}>
        {!specialTemplates[paymentMethod] && (
          <View style={tw`w-full h-10 -mt-10`}>
            <LinearGradient colorList={whiteGradient} angle={90} />
          </View>
        )}
        <View style={tw`items-center flex-grow `}>
          <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={() => $formRef?.save()} narrow>
            {i18n('confirm')}
          </PrimaryButton>
        </View>
      </Fade>
    </View>
  )
}
