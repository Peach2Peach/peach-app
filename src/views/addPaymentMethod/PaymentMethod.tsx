import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { DrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Flag, Icon, PrimaryButton, RadioButtons, Text } from '../../components'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { PaymentMethodSelect } from '../../drawers/PaymentMethodSelect'
import { CountrySelect } from '../../drawers/CountrySelect'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'
import { FlagType } from '../../components/flags'
import { whiteGradient } from '../../utils/layout'

const { LinearGradient } = require('react-native-gradients')

type PaymentCategorySelectProps = {
  currency: Currency
  paymentMethod?: PaymentMethod
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>
  back: () => void
  next: () => void
}

export default ({ currency, paymentMethod, setPaymentMethod, back, next }: PaymentCategorySelectProps): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)

  const [stepValid, setStepValid] = useState(false)
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const [country, setCountry] = useState<FlagType>()
  const paymentCategories = getApplicablePaymentCategories(currency).map((c) => ({
    value: c,
    display: i18n(`paymentCategory.${c}`),
  }))
  const [localMethods, setLocalMethods] = useState<{ value: PaymentMethod; display: string }[]>([])

  const restoreDefaults = () => {
    setPaymentCategory(undefined)
    setPaymentMethod(undefined)
    setCountry(undefined)
  }

  const closeDrawer = () => updateDrawer({ show: false })

  const selectPaymentMethod = (method: PaymentMethod) => {
    closeDrawer()
    setPaymentMethod(method)
    setStepValid(true)
    next()
  }
  const selectCountry = (c: FlagType) => {
    const local = LOCALPAYMENTMETHODS[currency]![c].map((method) => ({
      value: method,
      display: i18n(`paymentMethod.${method}`),
    }))
    closeDrawer()
    setCountry(c)
    setLocalMethods(local)
    setPaymentMethod(local[0]?.value)
  }

  const showDrawer = (category: PaymentCategory) => {
    if (category === 'localOption') {
      const applicableCountries = Object.keys(LOCALPAYMENTMETHODS[currency]!) as FlagType[]
      return updateDrawer({
        title: i18n(`paymentCategory.${category}`),
        content: <CountrySelect countries={applicableCountries} onSelect={selectCountry} />,
        show: true,
        onClose: () => {
          if (!country) setPaymentCategory(undefined)
        },
      })
    }

    const applicablePaymentMethods = PAYMENTCATEGORIES[category]
      .filter((method) => paymentMethodAllowedForCurrency(method, currency))
      .filter((method) => category !== 'giftCard' || method.split('.').pop()!.length !== 2)

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
  }, [paymentCategory])

  useEffect(() => {
    setStepValid(!!paymentMethod)
  }, [paymentMethod])

  return (
    <View style={tw`flex h-full`}>
      <View style={tw`flex justify-center flex-shrink h-full px-10`}>
        {!country ? (
          <RadioButtons items={paymentCategories} selectedValue={paymentCategory} onChange={setPaymentCategory} />
        ) : (
          <View>
            <Pressable style={tw`flex flex-row items-center px-8`} onPress={() => showDrawer('localOption')}>
              <Flag id={country} style={tw`w-8 h-8 mr-4 overflow-hidden`} />
              <Text style={tw`flex-shrink w-full uppercase drawer-title`}>{i18n(`country.${country}`)}</Text>
              <Icon id="refreshCcw" style={tw`w-7 h-7`} color={tw`text-primary-main`.color} />
            </Pressable>
            <RadioButtons
              style={tw`mt-16`}
              items={localMethods}
              selectedValue={paymentMethod}
              onChange={setPaymentMethod}
            />
          </View>
        )}
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
