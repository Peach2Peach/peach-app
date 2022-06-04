import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { Checkboxes, Text } from '../../../components'
import { Item } from '../../../components/inputs'
import { PaymentMethodView } from '../../../components/inputs/paymentMethods/PaymentMethodView'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import { account, addPaymentData, getPaymentData, updateSettings } from '../../../utils/account'
import { dataToMeansOfPayment } from '../../../utils/paymentMethod'

const getSelectedPaymentData = (preferredMoPs: Settings['preferredPaymentMethods']) =>
  (Object.keys(preferredMoPs) as PaymentMethod[]).reduce(
    (arr: string[], type: PaymentMethod) => {
      const id = preferredMoPs[type]
      if (!id) return arr
      return arr.concat(id)
    }, [])

const dummy = () => {}

type PaymentDataKeyFactsProps = {
  paymentData: PaymentData,
}
const PaymentDataKeyFacts = ({ paymentData }: PaymentDataKeyFactsProps) => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentDataUpdate = (data: PaymentData) => {
    addPaymentData(data)
    updateOverlay({ content: null, showCloseButton: true })
  }
  const editPaymentMethod = () => updateOverlay({
    content: <PaymentMethodView data={paymentData} onSubmit={onPaymentDataUpdate} />,
    showCloseIcon: false,
    showCloseButton: false
  })

  return <Pressable onPress={editPaymentMethod}>
    <View style={tw`flex-row`}>
      <Item style={tw`h-5 px-1 mr-2`} label={paymentData.type} isSelected={false} onPress={dummy} />
      {paymentData.currencies.map(currency => <Item style={tw`h-5 px-1 mx-px`}
        key={currency}
        label={currency}
        isSelected={true}
        onPress={dummy}
      />)}
    </View>
  </Pressable>
}

type PaymentDetailsProps = {
  paymentData: PaymentData[],
  setMeansOfPayment: React.Dispatch<React.SetStateAction<SellOffer['meansOfPayment']>>
}
export default ({ paymentData, setMeansOfPayment }: PaymentDetailsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const preferredMoPs = account.settings.preferredPaymentMethods
  const selectedPaymentData = getSelectedPaymentData(account.settings.preferredPaymentMethods)

  const update = () => {
    setMeansOfPayment(getSelectedPaymentData(account.settings.preferredPaymentMethods).map(getPaymentData)
      .filter(data => data)
      .reduce((mop, data) => dataToMeansOfPayment(mop, data!), {}))
  }

  const onPaymentDataUpdate = () => {
    updateOverlay({ content: null, showCloseButton: true })
    update()
  }
  const editPaymentMethod = (data: PaymentData) => {
    updateOverlay({
      content: <PaymentMethodView data={data} onSubmit={onPaymentDataUpdate} />,
      showCloseButton: false
    })
  }

  useEffect(() => {
    update()
  }, [paymentData])

  const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
    value: data.id,
    display: <Pressable onPress={() => editPaymentMethod(data)}>
      <PaymentDataKeyFacts paymentData={data} />
    </Pressable>,
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