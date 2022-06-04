import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { Checkboxes, Text } from '../../../components'
import { Item } from '../../../components/inputs'
import { PaymentMethodView } from '../../../components/inputs/paymentMethods/PaymentMethodView'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import { account, addPaymentData, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../../utils/account'
import { dataToMeansOfPayment, hashPaymentData, isValidPaymentdata } from '../../../utils/paymentMethod'

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

  const isValid = isValidPaymentdata(paymentData)

  return <Pressable onPress={editPaymentMethod}>
    <Text style={!isValid ? tw`text-red` : {}}>{paymentData.label}</Text>
    <View style={tw`flex-row mt-2`}>
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
  setPaymentData: React.Dispatch<React.SetStateAction<SellOffer['paymentData']>>
  setMeansOfPayment: React.Dispatch<React.SetStateAction<SellOffer['meansOfPayment']>>
}
export default ({ paymentData, setPaymentData, setMeansOfPayment }: PaymentDetailsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const preferredMoPs = account.settings.preferredPaymentMethods
  const selectedPaymentData = getSelectedPaymentDataIds()

  const update = () => {
    setPaymentData(paymentData.reduce((obj, data) => {
      obj[data.type] = hashPaymentData(data)

      return obj
    }, {} as SellOffer['paymentData']))
    setMeansOfPayment(selectedPaymentData.map(getPaymentData)
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