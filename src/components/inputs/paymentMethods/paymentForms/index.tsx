import React, { RefObject, ReactElement, useEffect, useRef, useState, useContext } from 'react'
import { SEPA } from './SEPA'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { ApplePay } from './ApplePay'
import { Wise } from './Wise'
import { BankTransferCH } from './BankTransferCH'
import { BankTransferUK } from './BankTransferUK'
import { Twint } from './Twint'
import { Bizum } from './Bizum'
import { Swish } from './Swish'
import { MBWay } from './MBWay'
import { Fade } from '../../../animation'
import { Pressable, View } from 'react-native'
import Icon from '../../../Icon'
import Button from '../../../Button'
import { Text } from '../../../text'
import keyboard from '../../../../effects/keyboard'
import { removePaymentData } from '../../../../utils/account'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { OverlayContext } from '../../../../contexts/overlay'
import { paymentDataChanged } from '../../../../utils/paymentMethod'
import PaymentMethodEdit from '../../../../overlays/info/PaymentMethodEdit'
// import { Tether } from './Tether'

type FormRef = {
  buildPaymentData: () => PaymentData,
  save: () => void,
}

export type PaymentMethodFormProps = ComponentProps & {
  paymentMethod: PaymentMethod,
  data?: Partial<PaymentData>,
  view: 'new' | 'edit' | 'view',
  onSubmit?: (data: PaymentData) => void,
  onChange?: (data: Partial<PaymentData>) => void,
  onCancel?: (data: Partial<PaymentData>) => void,
}
type PaymentMethodFormType = (props: PaymentMethodFormProps) => ReactElement
export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodFormType
}
export const PaymentMethodForms: PaymentMethodForms = {
  sepa: SEPA,
  bankTransferCH: BankTransferCH,
  bankTransferUK: BankTransferUK,
  paypal: PayPal,
  revolut: Revolut,
  applePay: ApplePay,
  wise: Wise,
  twint: Twint,
  swish: Swish,
  mbWay: MBWay,
  bizum: Bizum,
  // tether: Tether,
}

// eslint-disable-next-line max-lines-per-function
export const PaymentMethodForm = ({
  paymentMethod,
  data,
  view,
  onSubmit,
  onChange,
  onCancel,
  style,
}: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const Form = PaymentMethodForms[paymentMethod]!
  let $formRef = useRef<FormRef>(null).current

  const submit = (newPaymentData: PaymentData) => {
    if (!$formRef || !onSubmit) return

    if (data && paymentDataChanged(data as PaymentData, newPaymentData)) {
      updateOverlay({
        content: <PaymentMethodEdit paymentData={newPaymentData} onConfirm={onSubmit} />,
        help: true
      })
    } else {
      onSubmit(newPaymentData)
    }
  }

  const cancel = () => {
    if ($formRef && onCancel) onCancel($formRef.buildPaymentData())
  }

  const remove = () => {
    if (data?.id) removePaymentData(data.id)
    if ($formRef && onCancel) onCancel($formRef.buildPaymentData())
  }

  useEffect(keyboard(setKeyboardOpen), [])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <Form
        forwardRef={(r: FormRef) => $formRef = r}
        paymentMethod={paymentMethod}
        data={data}
        view={view}
        onSubmit={submit}
        onChange={onChange}
        onCancel={onCancel}
      />
    </View>
    {view !== 'view'
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={cancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n(view === 'new' ? 'form.paymentMethod.add' : 'form.paymentMethod.update')}
          secondary={true}
          wide={false}
          onPress={() => $formRef?.save()}
        />
        {view === 'edit'
          ? <Pressable onPress={remove} style={tw`mt-6`}>
            <Text style={tw`font-baloo text-sm text-center underline text-white-1`}>
              {i18n('form.paymentMethod.remove')}
            </Text>
          </Pressable>
          : null
        }
      </Fade>
      : null
    }
  </View>
}