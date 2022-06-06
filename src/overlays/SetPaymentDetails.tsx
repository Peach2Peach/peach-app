import React, { ReactElement, useContext, useEffect, useState } from 'react'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import PaymentMethodSelect from './PaymentMethodSelect'
import { getCurrencies, getPaymentMethods } from '../utils/paymentMethod'
import { PaymentMethodForms } from '../components/inputs/paymentMethods/paymentForms'
import keyboard from '../effects/keyboard'
import { account, addPaymentData, getPaymentDataByType, saveAccount } from '../utils/account'
import { session, setSession } from '../utils/session'
import { Pressable, View } from 'react-native'
import { Fade, Headline } from '../components'

const initPaymentData = (meansOfPayment: MeansOfPayment) => {
  const paymentMethods = getPaymentMethods(meansOfPayment)
  const currencies = getCurrencies(meansOfPayment)

  return paymentMethods.map(type => {
    const existingPaymentMethodsOfType = getPaymentDataByType(type).length + 1
    const label = i18n(`paymentMethod.${type}`) + ' #' + existingPaymentMethodsOfType
    const selectedCurrencies = currencies.filter(currency => meansOfPayment[currency]?.indexOf(type) !== -1)

    return {
      label,
      type,
      currencies: selectedCurrencies
    }
  })
}

type SetPaymentDetailsProps = {
  meansOfPayment: MeansOfPayment,
  restoredPaymentData?: Partial<PaymentData>[],
  onConfirm: (meansOfPayment: MeansOfPayment) => void
}

// eslint-disable-next-line max-lines-per-function
export const SetPaymentDetails = ({
  meansOfPayment,
  restoredPaymentData,
  onConfirm
}: SetPaymentDetailsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const paymentMethods = getPaymentMethods(meansOfPayment)
  const [page, setPage] = useState(0)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>[]>(
    restoredPaymentData
    || initPaymentData(meansOfPayment)
  )
  const activePaymentMethod = paymentMethods[page]

  const PaymentMethodForm = activePaymentMethod ? PaymentMethodForms[activePaymentMethod] : null

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const addUnsavedPaymentData = async (newData: Partial<PaymentData>) => {
    setPaymentData(data => {
      if (paymentData.find(d => newData.type === d.type)) { // existing payment data, update
        data = data.map(d => {
          if (d.type !== newData.type) return d
          return newData
        })
      } else { // otherwise add
        data.push(newData)
      }
      return [...data]
    })
  }

  const confirm = async () => {
    if (page < paymentMethods.length - 1) {
      setPage(p => p + 1)
    } else {
      for (const newData of paymentData) {
        await addPaymentData(newData as PaymentData, false) // eslint-disable-line no-await-in-loop
      }
      await saveAccount(account, session.password!)
      await setSession({ unsavedPaymentData: null })

      closeOverlay()
      onConfirm(meansOfPayment)
    }
  }

  const onPaymentMethodSelect = (mops: MeansOfPayment) => updateOverlay({
    content: <SetPaymentDetails meansOfPayment={mops} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const goBack = () => {
    if (page === 0) {
      updateOverlay({
        content: <PaymentMethodSelect
          currencies={Object.keys(meansOfPayment) as Currency[]}
          meansOfPayment={meansOfPayment}
          onConfirm={onPaymentMethodSelect} />,
        showCloseIcon: true,
        showCloseButton: false
      })
    } else {
      setPage(p => p - 1)
    }
  }

  useEffect(keyboard(setKeyboardOpen), [])
  useEffect(() => {
    setSession({ unsavedPaymentData: paymentData })
  }, [paymentData])

  return <View style={tw`w-full h-full pt-14 flex items-center justify-between`}>
    <View style={tw`w-full`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('paymentMethod.details.title') + '\n'}
        {i18n(`paymentMethod.${activePaymentMethod}`)}
      </Headline>
    </View>
    <View style={tw`h-full flex justify-center flex-shrink`}>
      {PaymentMethodForm
        ? <PaymentMethodForm style={tw`h-full flex-shrink flex-col justify-between`}
          view="new"
          data={paymentData[page]}
          onSubmit={confirm}
          onChange={addUnsavedPaymentData}
          onCancel={goBack}
        />
        : null
      }
    </View>
    <View style={tw`w-full h-8 flex items-center justify-end`}>
      <Fade show={!keyboardOpen} style={tw`flex-row`}>
        {paymentMethods.map((paymentMethod, i) => <Pressable
          key={paymentMethod}
          style={[
            tw`w-4 h-4 bg-white-1 rounded-full`,
            page === i ? {} : tw`opacity-30`,
            i > 0 ? tw`ml-3` : {}
          ]}
          // onPress={() => i < page ? setPage(i) : null}
        />)}
      </Fade>
    </View>
  </View>
}

export default SetPaymentDetails