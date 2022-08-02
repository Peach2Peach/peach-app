import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { DrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Headline, RadioButtons } from '../../components'
import { PAYMENTCATEGORIES } from '../../constants'
import { PaymentMethodSelect } from '../../drawers/PaymentMethodSelect'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'

type PaymentCategorySelectProps = {
  currency: Currency,
  paymentMethod?: PaymentMethod,
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>
  setStepValid: React.Dispatch<React.SetStateAction<boolean>>,
  next: () => void,
}

export default ({
  currency,
  setPaymentMethod,
  setStepValid,
  next,
}: PaymentCategorySelectProps): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = getApplicablePaymentCategories(currency).map(c => ({
    value: c,
    display: i18n(`paymentCategory.${c}`)
  }))

  const closeDrawer = () => updateDrawer({ show: false })

  const selectPaymentMethod = (method: PaymentMethod) => {
    closeDrawer()
    setPaymentMethod(method)
    setStepValid(true)
    next()
  }

  const showDrawer = (category: PaymentCategory) => {
    const applicablePaymentMethods = PAYMENTCATEGORIES[category].filter(method =>
      paymentMethodAllowedForCurrency(method, currency)
    )
    updateDrawer({
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

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n('paymentMethod.select.title')}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <RadioButtons items={paymentCategories}
        selectedValue={paymentCategory}
        onChange={cat => setPaymentCategory(cat as PaymentCategory)}
      />
    </View>
  </View>
}