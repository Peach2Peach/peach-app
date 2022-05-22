import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { Card, Headline, Icon, RadioButtons, RadioButtonsWithCTA, Text } from '../../../components'
import AddPaymentMethod from '../../../components/inputs/paymentMethods/AddPaymentMethod'
import { PaymentMethodView } from '../../../components/inputs/paymentMethods/PaymentMethodView'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import { account, getPaymentDataByType, updateSettings } from '../../../utils/account'
import { sha256 } from '../../../utils/crypto'
import i18n from '../../../utils/i18n'
import { getPaymentMethods } from '../../../utils/paymentMethod'

const mapPaymentDataToRadioItem = (paymentData: PaymentData) => ({
  value: paymentData.id,
  display: paymentData.id,
  data: paymentData,
})

type PaymentDetailsProps = {
  meansOfPayment: MeansOfPayment,
  paymentMethods: PaymentMethod[],
  setPaymentData: React.Dispatch<React.SetStateAction<SellOffer['paymentData']>>
}
export default ({ meansOfPayment, paymentMethods, setPaymentData }: PaymentDetailsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const preferredPaymentMethods = account.settings.preferredPaymentMethods

  const update = () => {
    const selectedPaymentData = getPaymentMethods(meansOfPayment).reduce((obj, mop) => {
      const preferredPaymentMethod = account.settings.preferredPaymentMethods[mop]
      if (preferredPaymentMethod) obj[mop] = sha256(preferredPaymentMethod)
      return obj
    }, {} as Settings['preferredPaymentMethods'])
    setPaymentData(selectedPaymentData)
  }
  const onPaymentDataUpdate = () => {
    updateOverlay({ content: null, showCloseButton: true })
    update()
  }
  const openAddPaymentMethodDialog = (method: PaymentMethod) => updateOverlay({
    content: <AddPaymentMethod method={method} onSubmit={onPaymentDataUpdate} />,
    showCloseButton: false
  })
  const editPaymentMethod = (data: PaymentData) => {
    updateOverlay({
      content: <PaymentMethodView data={data} onSubmit={onPaymentDataUpdate} />,
      showCloseButton: false
    })
  }
  const setPreferredPaymentMethods = (paymentMethod: PaymentMethod, id: PaymentData['id']) => {
    updateSettings({
      preferredPaymentMethods: {
        ...preferredPaymentMethods,
        [paymentMethod]: id
      }
    })
    update()
  }

  useEffect(() => {
    update()
  }, [meansOfPayment])

  return <View>
    <Headline style={tw`mt-16 text-grey-1`}>
      {i18n('sell.paymentDetails')}
    </Headline>
    {paymentMethods.map((paymentMethod, i) => {
      const dataByType = getPaymentDataByType(paymentMethod)
      return <View key={paymentMethod} style={i > 0 ? tw`mt-4` : {}}>
        {dataByType.length
          ? <RadioButtons items={dataByType.map(mapPaymentDataToRadioItem)}
            selectedValue={preferredPaymentMethods[paymentMethod]}
            onChange={id => setPreferredPaymentMethods(paymentMethod, id as string)}
            ctaLabel={i18n('edit')} ctaAction={editPaymentMethod} />
          : null
        }
        <Pressable onPress={() => openAddPaymentMethodDialog(paymentMethod)}>
          <Card style={tw`flex-row items-center justify-between p-3 mt-2`}>
            <Text>{i18n('form.paymentMethod.addDetails', i18n(`paymentMethod.${paymentMethod}`))}</Text>
            <Icon id="add" style={tw`w-4 h-4`} color={tw`text-grey-2`.color as string} />
          </Card>
        </Pressable>
      </View>
    })}
  </View>
}