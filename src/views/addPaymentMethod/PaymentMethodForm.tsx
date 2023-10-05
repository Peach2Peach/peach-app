import { Dispatch, SetStateAction, useCallback } from 'react'
import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { PeachScrollView } from '../../components/PeachScrollView'
import { PrimaryButton } from '../../components/buttons'
import { HeaderConfig } from '../../components/header/Header'
import { PaymentMethodForms } from '../../components/inputs/paymentMethods/paymentForms'
import { useSubmitForm } from '../../components/inputs/paymentMethods/paymentForms/hooks/useSubmitForm'
import { useDeletePaymentMethod } from '../../components/payment/hooks/useDeletePaymentMethod'
import { useRoute, useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { usePaymentMethodFormSetup } from './hooks'

export type FormProps = {
  data: Partial<PaymentData> & {
    type: PaymentMethod
    currencies: Currency[]
  }
  onSubmit: (data: PaymentData) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
  setFormData: Dispatch<SetStateAction<PaymentData | undefined>>
}

export const PaymentMethodForm = () => {
  const { data, onSubmit } = usePaymentMethodFormSetup()
  const { type: paymentMethod } = data
  const { stepValid, setStepValid, setFormData, submitForm } = useSubmitForm<PaymentData>(onSubmit)

  const Form = PaymentMethodForms[paymentMethod]?.component

  return (
    <Screen>
      <PaymentMethodFormHeader />
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <View style={tw`justify-center grow`}>
          {!!Form && <Form onSubmit={submitForm} {...{ data, setStepValid, setFormData }} />}
        </View>
        <PrimaryButton style={tw`self-center mb-5`} disabled={!stepValid} onPress={submitForm} narrow>
          {i18n('confirm')}
        </PrimaryButton>
      </PeachScrollView>
    </Screen>
  )
}

function PaymentMethodFormHeader () {
  const {
    paymentData: { type: paymentMethod, id },
  } = useRoute<'paymentMethodForm'>().params
  const showHelp = useShowHelp('currencies')
  const showLNURLHelp = useShowHelp('lnurl')
  const deletePaymentMethod = useDeletePaymentMethod(id ?? '')

  const getHeaderIcons = useCallback(() => {
    const icons: HeaderConfig['icons'] = []
    if (['revolut', 'wise', 'paypal', 'advcash'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showHelp }
    }
    if (paymentMethod === 'lnurl') {
      icons[0] = { ...headerIcons.help, onPress: showLNURLHelp }
    }
    if (id) {
      icons[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icons
  }, [paymentMethod, id, showHelp, showLNURLHelp, deletePaymentMethod])

  return (
    <Header
      title={i18n(
        id ? 'paymentMethod.edit.title' : 'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`),
      )}
      icons={getHeaderIcons()}
    />
  )
}
