import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { DrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Flag, Headline, Icon, RadioButtons, Text } from '../../components'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { PaymentMethodSelect } from '../../drawers/PaymentMethodSelect'
import { CountrySelect } from '../../drawers/CountrySelect'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'
import { FlagType } from '../../components/flags'
import { Navigation } from './components/Navigation'
import { whiteGradient } from '../../utils/layout'

const { LinearGradient } = require('react-native-gradients')

type PaymentCategorySelectProps = {
  currency: Currency,
  paymentMethod?: PaymentMethod,
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>
  back: () => void,
  next: () => void,
}

// eslint-disable-next-line max-lines-per-function
export default ({
  currency,
  paymentMethod,
  setPaymentMethod,
  back, next,
}: PaymentCategorySelectProps): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)

  const [stepValid, setStepValid] = useState(false)
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const [country, setCountry] = useState<FlagType>()
  const paymentCategories = getApplicablePaymentCategories(currency).map(c => ({
    value: c,
    display: i18n(`paymentCategory.${c}`)
  }))
  const [localMethods, setLocalMethods] = useState<{value: PaymentMethod, display: string}[]>([])

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
    const local = LOCALPAYMENTMETHODS[currency]![c].map(method => ({
      value: method,
      display: i18n(`paymentMethod.${method}`)
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
        content: <CountrySelect countries={applicableCountries}
          onSelect={selectCountry} />,
        show: true,
        onClose: () => {
          if (!country) setPaymentCategory(undefined)
        }
      })
    }

    const applicablePaymentMethods = PAYMENTCATEGORIES[category].filter(method =>
      paymentMethodAllowedForCurrency(method, currency)
    )
    return updateDrawer({
      title: i18n(`paymentCategory.${category}`),
      content: <PaymentMethodSelect paymentMethods={applicablePaymentMethods}
        showLogos={category !== 'bankTransfer'}
        onSelect={selectPaymentMethod} />,
      show: true,
      onClose: () => {
        setPaymentCategory(undefined)
      }
    })
  }

  useEffect(() => {
    if (!paymentCategory) return
    showDrawer(paymentCategory)
  }, [paymentCategory])

  useEffect(() => {
    setStepValid(!!paymentMethod)
  }, [paymentMethod])

  useEffect(() => {
    setStepValid(false)
  }, [])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n('paymentMethod.select')}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      {!country
        ? <RadioButtons items={paymentCategories}
          selectedValue={paymentCategory}
          onChange={cat => setPaymentCategory(cat as PaymentCategory)}
        />
        : <View>
          <Pressable style={tw`flex flex-row items-center px-8`} onPress={() => showDrawer('localOption')}>
            <Flag id={country} style={tw`w-8 h-8 mr-4 rounded overflow-hidden`} />
            <Text style={tw`font-baloo text-base uppercase w-full flex-shrink`}>
              {i18n(`country.${country}`)}
            </Text>
            <Icon id="change" style={tw`w-7 h-7`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <RadioButtons style={tw`mt-16`} items={localMethods}
            selectedValue={paymentMethod}
            onChange={method => setPaymentMethod(method as PaymentMethod)}
          />
        </View>
      }
    </View>
    <View style={tw`mt-4 px-6 flex items-center w-full bg-white-1`}>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <Navigation back={country ? restoreDefaults : back} next={next} stepValid={stepValid} />
    </View>
  </View>
}