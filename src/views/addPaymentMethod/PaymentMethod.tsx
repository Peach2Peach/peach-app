import { useState } from 'react'
import { View } from 'react-native'
import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { FlagType } from '../../components/flags'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { useDrawerContext } from '../../contexts/drawer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { keys } from '../../utils/object'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'

type Props = {
  currency: Currency
  setPaymentMethod: (method?: PaymentMethod) => void
  next: () => void
}

export const PaymentMethod = ({ currency, setPaymentMethod, next }: Props) => {
  const [, updateDrawer] = useDrawerContext()

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
      const applicableCountries = keys(LOCALPAYMENTMETHODS[currency]!)
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
    <View style={tw`h-full`}>
      <PeachScrollView contentStyle={[tw`h-full p-4`, tw.md`p-8`]} contentContainerStyle={tw`flex-grow`}>
        <RadioButtons
          style={tw`items-center justify-center flex-grow`}
          items={paymentCategories}
          selectedValue={paymentCategory}
          onChange={selectPaymentCategory}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!paymentCategory} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
