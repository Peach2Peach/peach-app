import React, { ReactElement, useContext, useRef, useState } from 'react'
import { View } from 'react-native'
import { COUNTRIES } from '../../../../constants'
import { OverlayContext } from '../../../../contexts/overlay'
import { useKeyboard } from '../../../../hooks'
import PaymentMethodEdit from '../../../../overlays/info/PaymentMethodEdit'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
import { paymentDataChanged } from '../../../../utils/paymentMethod'
import { specialTemplates } from '../../../../views/addPaymentMethod/specialTemplates'
import { Fade } from '../../../animation'
import { PrimaryButton } from '../../../buttons'
import PeachScrollView from '../../../PeachScrollView'
import { Bizum } from './Bizum'
import { GiftCardAmazon } from './giftCard.amazon'
import { MBWay } from './MBWay'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { Satispay } from './Satispay'
import { SEPA } from './SEPA'
import { InstantSepa } from './InstantSepa'
import { Swish } from './Swish'
import { Twint } from './Twint'
import { Wise } from './Wise'
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

type PaymentMethodFormType = (props: FormProps) => ReactElement
export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodFormType
}
export const PaymentMethodForms: PaymentMethodForms = {
  sepa: SEPA,
  instantSepa: InstantSepa,
  paypal: PayPal,
  revolut: Revolut,
  wise: Wise,
  twint: Twint,
  swish: Swish,
  satispay: Satispay,
  mbWay: MBWay,
  bizum: Bizum,
  'giftCard.amazon': GiftCardAmazon,
}
COUNTRIES.forEach((c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = GiftCardAmazon))

export const PaymentMethodForm = ({
  paymentMethod,
  data,
  currencies = [],
  onSubmit,
  style,
}: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const keyboardOpen = useKeyboard()
  const [stepValid, setStepValid] = useState(false)

  const Form = PaymentMethodForms[paymentMethod]!
  let $formRef = useRef<FormRef>(null).current

  const submit = (newPaymentData: PaymentData) => {
    if (!$formRef || !stepValid) return

    if (data.id && paymentDataChanged(data as PaymentData, newPaymentData)) {
      updateOverlay({
        title: i18n('help.paymentMethodEdit.title'),
        content: <PaymentMethodEdit />,
        visible: true,
        level: 'WARN',
        action2: {
          callback: () => {
            onSubmit(newPaymentData)
            updateOverlay({ visible: false })
          },
          icon: 'edit3',
          label: i18n('help.paymentMethodEdit.editMethod'),
        },
      })
    } else {
      onSubmit(newPaymentData)
    }
  }

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView
        contentContainerStyle={[
          tw`items-center justify-center flex-1`,
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
