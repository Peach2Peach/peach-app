import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { Checkboxes, } from '../../../components'
import { PaymentDataKeyFacts } from '../../../components/payment/PaymentDataKeyFacts'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../../utils/account'
import { dataToMeansOfPayment, hashPaymentData } from '../../../utils/paymentMethod'

type PaymentDetailsProps = {
  paymentData: PaymentData[],
  setPaymentData: React.Dispatch<React.SetStateAction<SellOffer['paymentData']>>
  setMeansOfPayment: React.Dispatch<React.SetStateAction<SellOffer['meansOfPayment']>>
}
export default ({ paymentData, setPaymentData, setMeansOfPayment }: PaymentDetailsProps): ReactElement => {
  const preferredMoPs = account.settings.preferredPaymentMethods
  const selectedPaymentData = getSelectedPaymentDataIds()

  const update = () => {
    setPaymentData(paymentData.reduce((obj, data) => {
      obj[data.type] = hashPaymentData(data)

      return obj
    }, {} as SellOffer['paymentData']))

    setMeansOfPayment(getSelectedPaymentDataIds().map(getPaymentData)
      .filter(data => data)
      .reduce((mop, data) => dataToMeansOfPayment(mop, data!), {}))
  }

  const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
    value: data.id,
    display: <PaymentDataKeyFacts paymentData={data} />,
    disabled: !!preferredMoPs[data.type] && preferredMoPs[data.type] !== data.id,
    data,
  })

  const setPreferredPaymentMethods = (ids: (string|number)[]) => {
    updateSettings({
      preferredPaymentMethods: (ids as PaymentData['id'][]).reduce((obj, id) => {
        const method = paymentData.find(d => d.id === id)!.type
        obj[method] = id
        return obj
      }, {} as Settings['preferredPaymentMethods'])
    })
    update()
  }

  useEffect(() => {
    update()
  }, [paymentData])

  return <View>
    <Checkboxes items={paymentData.map(mapPaymentDataToCheckboxes)}
      selectedValues={selectedPaymentData}
      onChange={setPreferredPaymentMethods}/>
  </View>
}