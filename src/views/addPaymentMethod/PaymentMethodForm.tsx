import { useCallback } from 'react'
import { Control, useController, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { PaymentMethodField } from '../../../peach-api/src/@types/payment'
import { Header, HeaderIcon } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { CurrencySelection } from '../../components/inputs/paymentForms/components'
import { useDeletePaymentMethod } from '../../components/payment/hooks/useDeletePaymentMethod'
import { useGoToOrigin } from '../../hooks/useGoToOrigin'
import { useRoute } from '../../hooks/useRoute'
import { useShowHelp } from '../../hooks/useShowHelp'
import { PAYMENTMETHODINFOS } from '../../paymentMethods'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { FormInput } from './FormInput'
import { LabelInput } from './LabelInput'
import { TabbedFormNavigation } from './TabbedFormNavigation'
import { useFormFields } from './useFormFields'

export type FormType = Record<PaymentMethodField, string> & { paymentMethodName: string; currencies: Currency[] }

export const PaymentMethodForm = () => {
  const { paymentData, origin } = useRoute<'paymentMethodForm'>().params
  const goBackTo = useGoToOrigin()
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const { type: paymentMethod, id, country, label } = paymentData

  const fields = useFormFields(paymentMethod)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    getFieldState,
    getValues,
    setValue,
  } = useForm<FormType>({ mode: 'all' })

  const onValid = (data: FormType) => {
    const { paymentMethodName, ...rest } = data
    const test = {
      ...rest,
      id: id || `${paymentMethod}-${Date.now()}`,
      label: paymentMethodName,
      type: paymentMethod,
      country,
    } satisfies PaymentData

    const dataIsValid = isValidPaymentData(test)
    if (dataIsValid) {
      addPaymentData(test)
      selectPaymentMethod(test.id)
      goBackTo(origin)
    }
  }

  return (
    <Screen header={<PaymentMethodFormHeader />}>
      {!!fields && (
        <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`gap-4 grow`}>
          <View style={tw`justify-center grow`}>
            <LabelInput name="paymentMethodName" control={control} id={id} defaultValue={label} />

            {fields.mandatory.map((row) => {
              if (row.length === 1) {
                const column = row[0]
                return column.map((field) => (
                  <FormInput
                    key={`formInput-${field}`}
                    name={field}
                    control={control}
                    defaultValue={paymentData[field]}
                  />
                ))
              }
              return (
                <TabbedFormNavigation
                  key={`tabbedFormNavigation-${row}`}
                  {...{ row, control, paymentData, getFieldState, getValues }}
                />
              )
            })}

            {fields.optional.map((field) => (
              <FormInput
                key={`formInput-${field}`}
                name={field}
                control={control}
                defaultValue={paymentData[field]}
                optional
              />
            ))}

            <CurrencySelectionController {...{ paymentData, setValue, control }} />
          </View>
          <Button style={tw`self-center`} disabled={!isValid} onPress={handleSubmit(onValid)}>
            {i18n('confirm')}
          </Button>
        </PeachScrollView>
      )}
    </Screen>
  )
}

function CurrencySelectionController ({
  paymentData: { type, currencies },
  control,
  setValue,
}: {
  paymentData: {
    type: PaymentMethod
    currencies: Currency[]
  }
  control: Control<FormType>
  setValue: (name: keyof FormType, value: Currency[]) => void
}) {
  const { field } = useController({
    control,
    defaultValue: currencies,
    name: 'currencies',
    rules: {
      validate: (value: Currency[]) => {
        const isValid = value.length > 0
        return isValid || i18n('form.required.error')
      },
    },
  })

  const onCurrencyToggle = (currency: Currency) => {
    const newCurrencies = field.value.includes(currency)
      ? field.value.filter((c) => c !== currency)
      : [...field.value, currency]
    setValue('currencies', newCurrencies)
  }

  if (!hasMultipleAvailableCurrencies(type)) return null

  return <CurrencySelection paymentMethod={type} onToggle={onCurrencyToggle} selectedCurrencies={field.value} />
}

function hasMultipleAvailableCurrencies (paymentMethod: PaymentMethod) {
  const selectedMethod = PAYMENTMETHODINFOS.find((pm) => pm.id === paymentMethod)
  return !!selectedMethod && selectedMethod.currencies.length > 1
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
