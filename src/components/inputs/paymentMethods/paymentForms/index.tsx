import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { OverlayContext } from '../../../../contexts/overlay'
import keyboard from '../../../../effects/keyboard'
import PaymentMethodEdit from '../../../../overlays/info/PaymentMethodEdit'
import tw from '../../../../styles/tailwind'
import { removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
import { StackNavigation } from '../../../../utils/navigation'
import { paymentDataChanged } from '../../../../utils/paymentMethod'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import PeachScrollView from '../../../PeachScrollView'
import { Text } from '../../../text'
import { Bizum } from './Bizum'
import { MBWay } from './MBWay'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { SEPA } from './SEPA'
import { Swish } from './Swish'
import { Twint } from './Twint'
import { Wise } from './Wise'
import { GiftCardAmazon } from './giftCard.amazon'
import { Cash } from './Cash'
import { COUNTRIES } from '../../../../constants'
const { LinearGradient } = require('react-native-gradients')

type FormRef = {
  buildPaymentData: () => PaymentData,
  save: () => void,
  validateForm: () => boolean,
}

export type PaymentMethodFormProps = ComponentProps & {
  paymentMethod: PaymentMethod,
  data: Partial<PaymentData>,
  currencies?: Currency[],
  country?: Country,
  onSubmit?: (data: PaymentData) => void,
  onChange?: (data: Partial<PaymentData>) => void,
  onDelete?: () => void,
  back?: () => void,
  navigation: StackNavigation,
}
type PaymentMethodFormType = (props: PaymentMethodFormProps) => ReactElement
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
  mbWay: MBWay,
  bizum: Bizum,
  'giftCard.amazon': GiftCardAmazon,
  cash: Cash,
}
COUNTRIES.forEach(c => PaymentMethodForms['giftCard.amazon.' + c as PaymentMethod] = GiftCardAmazon)

// eslint-disable-next-line max-lines-per-function
export const PaymentMethodForm = ({
  paymentMethod,
  data,
  currencies = [],
  onSubmit,
  onDelete,
  navigation,
  back,
  style,
}: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [stepValid, setStepValid] = useState(false)

  const Form = PaymentMethodForms[paymentMethod]!
  let $formRef = useRef<FormRef>(null).current

  const submit = (newPaymentData: PaymentData) => {
    if (!$formRef || !onSubmit) return

    if (data.id && paymentDataChanged(data as PaymentData, newPaymentData)) {
      updateOverlay({
        content: <PaymentMethodEdit paymentData={newPaymentData} onConfirm={onSubmit} />,
        help: true
      })
    } else {
      onSubmit(newPaymentData)
    }
  }

  const onChange = () => {
    if ($formRef) setStepValid($formRef.validateForm())
  }

  const remove = () => {
    if (data.id) removePaymentData(data.id)
    if ($formRef && onDelete) onDelete()
  }

  useEffect(keyboard(setKeyboardOpen), [])

  return <View style={[tw`flex`, style]}>
    <PeachScrollView style={tw`h-full flex-shrink`} contentContainerStyle={tw`min-h-full flex justify-center pb-10`}>
      <Form
        forwardRef={(r: FormRef) => $formRef = r}
        paymentMethod={paymentMethod}
        data={data}
        currencies={currencies}
        onSubmit={submit}
        onChange={onChange}
        navigation={navigation}
      />
    </PeachScrollView>
    <Fade show={!keyboardOpen} style={tw`w-full flex items-center mt-4`} displayNone={false}>
      {paymentMethod !== 'cash' &&
        <View style={tw`w-full h-10 -mt-10`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>}
      <Pressable testID="navigation-back" style={tw`absolute left-0 z-10`} onPress={back || navigation.goBack}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      <Button
        testID="navigation-next"
        disabled={!stepValid}
        wide={false}
        onPress={() => $formRef?.save()}
        title={i18n(!data.id ? 'next' : 'form.paymentMethod.update')}
      />
      {data.id
        ? <Pressable onPress={remove} style={tw`mt-6`}>
          <Text style={tw`font-baloo text-sm text-center underline text-peach-1`}>
            {i18n('form.paymentMethod.remove')}
          </Text>
        </Pressable>
        : null
      }
    </Fade>
  </View>
}