import { useState } from 'react'
import { useDrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { FlagType } from '../../components/flags'
import { LOCALPAYMENTMETHODCOUNTRIES, LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { getPaymentDataByType } from '../../utils/account'

export const SelectPaymentMethod = () => {
  useHeaderSetup(i18n('selectPaymentMethod.title'))

  const navigation = useNavigation()
  const { selectedCurrency, origin } = useRoute<'selectPaymentMethod'>().params
  const [, updateDrawer] = useDrawerContext()

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = getApplicablePaymentCategories(selectedCurrency).map((c) => ({
    value: c,
    display: i18n(`paymentCategory.${c}`),
  }))

  const goToPaymentMethodForm = (paymentMethod: PaymentMethod) => {
    const existingPaymentMethodsOfType = getPaymentDataByType(paymentMethod).length
    let label = i18n(`paymentMethod.${paymentMethod}`)
    if (existingPaymentMethodsOfType > 0) label += ` #${existingPaymentMethodsOfType + 1}`

    navigation.navigate('paymentMethodForm', {
      paymentData: { type: paymentMethod, label, currencies: [selectedCurrency] },
      origin,
    })
  }

  const unselectCategory = () => setPaymentCategory(undefined)

  const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
    unselectCategory()
    updateDrawer({ show: false })

    if (paymentMethod === 'giftCard.amazon') {
      navigation.navigate('selectCountry', { selectedCurrency, origin })
    } else {
      goToPaymentMethodForm(paymentMethod)
    }
  }

  const getCountrySelectDrawer = (
    category: PaymentCategory,
    selectCountry: (country: FlagType, c: PaymentCategory) => void,
  ) => ({
    title: i18n(`paymentCategory.${category}`),
    options: LOCALPAYMENTMETHODCOUNTRIES.map((country) => ({
      title: i18n(`country.${country}`),
      flagID: country,
      onPress: () => selectCountry(country, category),
    })),
    show: true,
    onClose: unselectCategory,
  })

  const selectCountry = (country: FlagType, category: PaymentCategory) => {
    const localOptions = LOCALPAYMENTMETHODS.EUR[country]
    updateDrawer({
      title: i18n(`country.${country}`),
      options: localOptions.map((localOption) => ({
        title: i18n(`paymentMethod.${localOption}`),
        logoID: localOption,
        onPress: () => selectPaymentMethod(localOption),
      })),
      previousDrawer: getCountrySelectDrawer(category, selectCountry),
      show: true,
      onClose: unselectCategory,
    })
  }

  const showDrawer = (category: PaymentCategory) => {
    if (category === 'localOption') {
      updateDrawer(getCountrySelectDrawer(category, selectCountry))
    } else {
      const applicablePaymentMethods = PAYMENTCATEGORIES[category]
        .filter((method) => paymentMethodAllowedForCurrency(method, selectedCurrency))
        .filter((method) => category !== 'giftCard' || method === 'giftCard.amazon')

      updateDrawer({
        title: i18n(`paymentCategory.${category}`),
        options: applicablePaymentMethods.map((method) => ({
          title: i18n(`paymentMethod.${method}`),
          logoID: method,
          onPress: () => selectPaymentMethod(method),
        })),
        show: true,
        onClose: unselectCategory,
      })
    }
  }

  const selectPaymentCategory = (category: PaymentCategory) => {
    setPaymentCategory(category)
    showDrawer(category)
  }

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
        <RadioButtons
          style={tw`items-center`}
          items={paymentCategories}
          selectedValue={paymentCategory}
          onChange={selectPaymentCategory}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!paymentCategory} narrow>
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
