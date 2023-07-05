import { useCallback, useState } from 'react'
import { useDrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { FlagType } from '../../components/flags'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import {
  getApplicablePaymentCategories,
  isAmazonGiftCard,
  paymentMethodAllowedForCurrency,
} from '../../utils/paymentMethod'
import { useNavigation, useRoute } from '../../hooks'
import { getPaymentDataByType } from '../../utils/account'

export const SelectPaymentMethod = () => {
  const navigation = useNavigation()
  // TODO: fix type
  const { selectedCurrency: currency } = useRoute<'selectPaymentMethod'>().params
  const next = (paymentMethod: PaymentMethod) => {
    navigation.navigate('selectCountry', { paymentMethod, selectedCurrency: currency, origin: 'buy' })
  }
  const [, updateDrawer] = useDrawerContext()

  const goToPaymentMethodForm = useCallback(
    (data: Pick<PaymentData, 'currencies' | 'country'> & { paymentMethod: PaymentMethod }) => {
      if (!data.paymentMethod || !data.currencies) return
      const methodType
        = data.paymentMethod === 'giftCard.amazon' && data.country
          ? (`${data.paymentMethod}.${data.country}` satisfies PaymentMethod)
          : data.paymentMethod
      const existingPaymentMethodsOfType = getPaymentDataByType(methodType).length
      let label = i18n(`paymentMethod.${methodType}`)
      if (existingPaymentMethodsOfType > 0) label += ` #${existingPaymentMethodsOfType + 1}`

      navigation.push('paymentMethodForm', {
        paymentData: { type: data.paymentMethod, label, currencies: data.currencies, country: data.country },
        // TODO: fix type
        selectedCurrency: currency,
        origin: 'buy',
      })
    },
    [navigation, currency],
  )

  const setPaymentMethod = (method?: PaymentMethod) => {
    updateDrawer({ show: false })
    if (!method) return

    if (isAmazonGiftCard(method)) {
      next(method)
      return
    }

    goToPaymentMethodForm({ paymentMethod: method, currencies: [currency] })
  }

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = getApplicablePaymentCategories(currency).map((c) => ({
    value: c,
    display: i18n(`paymentCategory.${c}`),
  }))

  const unselectCategory = () => setPaymentCategory(undefined)
  const selectPaymentMethod = (method: PaymentMethod) => {
    unselectCategory()
    setPaymentMethod(method)
  }

  const getCountrySelectDrawer = (
    category: PaymentCategory,
    applicableCountries: FlagType[],
    selectCountry: Function,
  ) => ({
    title: i18n(`paymentCategory.${category}`),
    options: applicableCountries.map((country) => ({
      title: i18n(`country.${country}`),
      flagID: country,
      onPress: () => selectCountry(country, category, applicableCountries),
    })),
    show: true,
    onClose: unselectCategory,
  })

  const selectCountry = (c: FlagType, category: PaymentCategory, applicableCountries: FlagType[]) => {
    const localOptions = LOCALPAYMENTMETHODS[currency]?.[c]
    if (localOptions) {
      return updateDrawer({
        title: i18n(`country.${c}`),
        options: localOptions.map((localOption) => ({
          title: i18n(`paymentMethod.${localOption}`),
          logoID: localOption,
          onPress: () => selectPaymentMethod(localOption),
        })),
        previousDrawer: getCountrySelectDrawer(category, applicableCountries, selectCountry),
        show: true,
        onClose: unselectCategory,
      })
    }
    return false
  }

  const showDrawer = (category: PaymentCategory) => {
    if (category === 'localOption') {
      const applicableCountries = Object.keys(LOCALPAYMENTMETHODS[currency]!) as FlagType[]
      return updateDrawer(getCountrySelectDrawer(category, applicableCountries, selectCountry))
    }

    const applicablePaymentMethods = PAYMENTCATEGORIES[category]
      .filter((method) => paymentMethodAllowedForCurrency(method, currency))
      .filter((method) => category !== 'giftCard' || method === 'giftCard.amazon')

    return updateDrawer({
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
