import { ReactElement, useContext, useEffect, useState } from 'react';
import * as React from 'react';
import { View } from 'react-native'
import { DrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PrimaryButton, RadioButtons } from '../../components'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { PaymentMethodSelect } from '../../drawers/PaymentMethodSelect'
import { CountrySelect } from '../../drawers/CountrySelect'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'
import { FlagType } from '../../components/flags'
import { whiteGradient } from '../../utils/layout'
import { LocalOptionsSelect } from '../../drawers/LocalOptionsSelect'

const { LinearGradient } = require('react-native-gradients')

type PaymentCategorySelectProps = {
  currency: Currency
  paymentMethod?: PaymentMethod
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>
  next: () => void
}

export default ({ currency, paymentMethod, setPaymentMethod, next }: PaymentCategorySelectProps): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)

  const [stepValid, setStepValid] = useState(false)
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = getApplicablePaymentCategories(currency).map((c) => ({
    value: c,
    display: i18n(`paymentCategory.${c}`),
  }))

  const closeDrawer = () => updateDrawer({ show: false })

  const selectPaymentMethod = (method: PaymentMethod) => {
    closeDrawer()
    setPaymentMethod(method)
    setStepValid(true)
    next()
  }

  const countrySelectdrawer = (category: PaymentCategory, applicableCountries: FlagType[], selectCountry: Function) => ({
    title: i18n(`paymentCategory.${category}`),
    content: (
      <CountrySelect countries={applicableCountries} onSelect={(c) => selectCountry(c, category, applicableCountries)} />
    ),
    show: true,
    onClose: () => {
      setPaymentCategory(undefined)
    },
  })

  const selectCountry = (c: FlagType, category: PaymentCategory, applicableCountries: FlagType[]) => {
    const local = LOCALPAYMENTMETHODS[currency]?.[c].map((method) => ({
      value: method,
      display: i18n(`paymentMethod.${method}`),
    }))
    if (local) {
      setPaymentMethod(local[0]?.value)
      return updateDrawer({
        title: i18n(`country.${c}`),
        content: (
          <LocalOptionsSelect
            local={local}
            onSelect={(method) => {
              setPaymentMethod(method)
              updateDrawer({ show: false })
              next()
            }}
          />
        ),
        previousDrawer: countrySelectdrawer(category, applicableCountries, selectCountry),
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const applicableCountries = Object.keys(LOCALPAYMENTMETHODS[currency]!) as FlagType[]
      return updateDrawer(countrySelectdrawer(category, applicableCountries, selectCountry))
    }

    const applicablePaymentMethods = PAYMENTCATEGORIES[category]
      .filter((method) => paymentMethodAllowedForCurrency(method, currency))
      .filter((method) => category !== 'giftCard' || method.split('.').pop()?.length !== 2)
      .filter((method) => !(category === 'onlineWallet' && method === 'mobilePay' && currency === 'EUR'))

    return updateDrawer({
      title: i18n(`paymentCategory.${category}`),
      content: <PaymentMethodSelect paymentMethods={applicablePaymentMethods} onSelect={selectPaymentMethod} />,
      show: true,
      onClose: () => {
        setPaymentCategory(undefined)
      },
    })
  }

  useEffect(() => {
    if (!paymentCategory) return
    showDrawer(paymentCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentCategory])

  useEffect(() => {
    setStepValid(!!paymentMethod)
  }, [paymentMethod])

  return (
    <View style={tw`flex h-full`}>
      <View style={tw`flex justify-center flex-shrink h-full px-10`}>
        <RadioButtons items={paymentCategories} selectedValue={paymentCategory} onChange={setPaymentCategory} />
      </View>
      <View style={tw`flex items-center w-full px-6 mt-4 bg-primary-background`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
      </View>
    </View>
  )
}
