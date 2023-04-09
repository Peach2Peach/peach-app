import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { WalletInput } from '../../WalletInput'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'wallet',
    display: i18n('form.wallet'),
  },
  {
    id: 'email',
    display: i18n('form.email'),
  },
]
const referenceRules = { required: false }

export const Template2 = ({ forwardRef, data, currencies = [], onSubmit, setStepValid, paymentMethod }: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [wallet, setWallet] = useState(data?.wallet || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const anyFieldSet = !!email || !!wallet

  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
      required: true,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ email: true, required: !wallet }), [wallet])
  const walletRules = useMemo(() => ({ advcashWallet: true, required: !email }), [email])

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const walletErrors = useMemo(() => getErrorsInField(wallet, walletRules), [wallet, walletRules])
  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = (): PaymentData & ADVCashData => ({
    id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
    label,
    type: paymentMethod,
    wallet,
    email,
    reference,
    currencies: selectedCurrencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...emailErrors, ...walletErrors].length === 0
  }, [emailErrors, labelErrors, walletErrors])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      <View style={tw`mt-2`}>
        {currentTab.id === 'wallet' && (
          <WalletInput
            onChange={setWallet}
            onSubmit={$reference?.focus}
            value={wallet}
            required={!anyFieldSet}
            placeholder={i18n('form.wallet.placeholder')}
            errorMessage={displayErrors ? walletErrors : undefined}
          />
        )}
        {currentTab.id === 'email' && (
          <EmailInput
            onChange={setEmail}
            onSubmit={$reference?.focus}
            value={email}
            required={!anyFieldSet}
            placeholder={i18n('form.email.placeholder')}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        )}
      </View>
      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? referenceError : undefined}
      />
      <CurrencySelection
        paymentMethod={paymentMethod}
        selectedCurrencies={selectedCurrencies}
        onToggle={onCurrencyToggle}
      />
    </View>
  )
}
