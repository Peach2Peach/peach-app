import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { OverlayContext } from '../../../../contexts/overlay'
import PaymentMethodEdit from '../../../../overlays/info/PaymentMethodEdit'
import tw from '../../../../styles/tailwind'
import { removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
import { paymentDataChanged } from '../../../../utils/paymentMethod'
import { Fade } from '../../../animation'
import { PrimaryButton } from '../../../buttons'
import Icon from '../../../Icon'
import PeachScrollView from '../../../PeachScrollView'
import { Text } from '../../../text'
import { Bizum } from './Bizum'
import { MBWay } from './MBWay'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { SEPA } from './SEPA'
import { Swish } from './Swish'
import { Satispay } from './Satispay'
import { Twint } from './Twint'
import { Wise } from './Wise'
import { GiftCardAmazon } from './giftCard.amazon'
import { Cash } from './Cash'
import { COUNTRIES } from '../../../../constants'
import { CashAmsterdam } from './Cash.amsterdam'
import { specialTemplates } from '../../../../views/addPaymentMethod/specialTemplates'
import { CashBelgianEmbassy } from './Cash.belgianEmbassy'
import { CashLugano } from './Cash.lugano'
import { useKeyboard, useNavigation } from '../../../../hooks'
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
  back?: () => void
}
export type FormProps = PaymentMethodFormProps & { setStepValid: React.Dispatch<React.SetStateAction<boolean>> }

type PaymentMethodFormType = (props: FormProps) => ReactElement
export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodFormType
}
export const PaymentMethodForms: PaymentMethodForms = {
  sepa: SEPA,
  paypal: PayPal,
  revolut: Revolut,
  wise: Wise,
  twint: Twint,
  swish: Swish,
  satispay: Satispay,
  mbWay: MBWay,
  bizum: Bizum,
  'giftCard.amazon': GiftCardAmazon,
  cash: Cash,
  'cash.amsterdam': CashAmsterdam,
  'cash.belgianEmbassy': CashBelgianEmbassy,
  'cash.lugano': CashLugano,
}
COUNTRIES.forEach((c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = GiftCardAmazon))

export const PaymentMethodForm = ({
  paymentMethod,
  data,
  currencies = [],
  onSubmit,
  onDelete,
  back,
  style,
}: PaymentMethodFormProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const keyboardOpen = useKeyboard()
  const [stepValid, setStepValid] = useState(false)

  const Form = PaymentMethodForms[paymentMethod]!
  let $formRef = useRef<FormRef>(null).current

  const submit = (newPaymentData: PaymentData) => {
    if (!$formRef || !stepValid) return

    if (data.id && paymentDataChanged(data as PaymentData, newPaymentData)) {
      updateOverlay({
        content: <PaymentMethodEdit paymentData={newPaymentData} onConfirm={onSubmit} />,
        visible: false,
      })
    } else {
      onSubmit(newPaymentData)
    }
  }

  const remove = () => {
    if (data.id) removePaymentData(data.id)
    if ($formRef && onDelete) onDelete()
  }

  return (
    <View style={[tw`flex`, style]}>
      <PeachScrollView
        style={tw`h-full flex-shrink`}
        contentContainerStyle={[tw`flex`, !specialTemplates[paymentMethod] ? tw`pb-10 pt-4` : {}]}
      >
        <Form
          forwardRef={(r: FormRef) => ($formRef = r)}
          onSubmit={submit}
          {...{ paymentMethod, data, currencies, setStepValid }}
        />
      </PeachScrollView>
      <Fade show={!keyboardOpen} style={tw`w-full flex items-center mb-16`}>
        {!specialTemplates[paymentMethod] && (
          <View style={tw`w-full h-10 -mt-10`}>
            <LinearGradient colorList={whiteGradient} angle={90} />
          </View>
        )}
        <View style={tw`flex-row pr-10 w-full items-stretch mb-2`}>
          <Pressable testID="navigation-back" onPress={back || navigation.goBack}>
            <Icon
              id="arrowLeft"
              style={tw`w-10 h-10`}
              color={specialTemplates[paymentMethod]?.button?.bgColor?.backgroundColor || tw`text-peach-1`.color}
            />
          </Pressable>
          <View style={tw`flex-grow items-center`}>
            <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={() => $formRef?.save()} narrow>
              {i18n(!data.id ? 'next' : 'form.paymentMethod.update')}
            </PrimaryButton>
          </View>
        </View>
        {data.id ? (
          <Pressable onPress={remove} style={tw`mt-6`}>
            <Text style={tw`font-baloo text-sm text-center underline text-peach-1`}>
              {i18n('form.paymentMethod.remove')}
            </Text>
          </Pressable>
        ) : null}
      </Fade>
    </View>
  )
}
