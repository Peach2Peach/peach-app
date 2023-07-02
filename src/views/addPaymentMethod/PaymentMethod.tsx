import { useState } from 'react'
import { View } from 'react-native'
import { useDrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { FlagType } from '../../components/flags'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'

type Props = {
  currency: Currency
  paymentMethod?: PaymentMethod
  setPaymentMethod: (method?: PaymentMethod) => void
  next: () => void
}

export const PaymentMethod = ({ currency, paymentMethod, setPaymentMethod, next }: Props) => {
  const [, updateDrawer] = useDrawerContext()

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = getApplicablePaymentCategories(currency).map((c) => ({
    value: c,
    display: i18n(`paymentCategory.${c}`),
  }))

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
    onClose: () => {
      setPaymentCategory(undefined)
    },
  })

  const selectCountry = (c: FlagType, category: PaymentCategory, applicableCountries: FlagType[]) => {
    const localOptions = LOCALPAYMENTMETHODS[currency]?.[c]
    if (localOptions) {
      return updateDrawer({
        title: i18n(`country.${c}`),
        options: localOptions.map((localOption) => ({
          title: i18n(`paymentMethod.${localOption}`),
          logoID: localOption,
          onPress: () => setPaymentMethod(localOption),
        })),
        previousDrawer: getCountrySelectDrawer(category, applicableCountries, selectCountry),
        show: true,
        onClose: () => {
          setPaymentMethod(undefined)
        },
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
      // TODO: what the heck is going on here? Why are we doing this?
      .filter((method) => category !== 'giftCard' || method.split('.').pop()?.length !== 2)
      .filter((method) => !(category === 'onlineWallet' && method === 'mobilePay' && currency === 'EUR'))

    return updateDrawer({
      title: i18n(`paymentCategory.${category}`),
      options: applicablePaymentMethods.map((method) => ({
        title: i18n(`paymentMethod.${method}`),
        logoID: method,
        onPress: () => setPaymentMethod(method),
      })),
      show: true,
      onClose: () => {
        setPaymentMethod(undefined)
      },
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
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!paymentMethod} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
