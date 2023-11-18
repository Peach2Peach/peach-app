import { Dispatch, SetStateAction, useCallback } from 'react'
import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { HeaderIcon } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Button } from '../../components/buttons/Button'
import { PaymentMethodForms } from '../../components/inputs/paymentMethods/paymentForms'
import { useSubmitForm } from '../../components/inputs/paymentMethods/paymentForms/hooks/useSubmitForm'
import { useDeletePaymentMethod } from '../../components/payment/hooks/useDeletePaymentMethod'
import { useRoute, useShowHelp } from '../../hooks'
import { useGoToOrigin } from '../../hooks/useGoToOrigin'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'

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
  const { paymentData, origin } = useRoute<'paymentMethodForm'>().params
  const goBackTo = useGoToOrigin()
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const onSubmit = (data: PaymentData) => {
    addPaymentData(data)
    selectPaymentMethod(data.id)
    goBackTo(origin)
  }
  const { type: paymentMethod } = paymentData
  const { stepValid, setStepValid, setFormData, submitForm } = useSubmitForm<PaymentData>(onSubmit)

  const Form = PaymentMethodForms[paymentMethod]

  return (
    <Screen header={<PaymentMethodFormHeader />}>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <View style={tw`justify-center pb-4 grow`}>
          {!!Form && <Form onSubmit={submitForm} data={paymentData} {...{ setStepValid, setFormData }} />}
        </View>
        <Button style={tw`self-center`} disabled={!stepValid} onPress={submitForm}>
          {i18n('confirm')}
        </Button>
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
    const icons: HeaderIcon[] = []
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
