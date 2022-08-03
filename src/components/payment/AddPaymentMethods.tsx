import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import { OverlayContext } from '../../contexts/overlay'
import CurrencySelect from '../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../overlays/PaymentMethodSelect'
import SetPaymentDetails from '../../overlays/SetPaymentDetails'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { dataToMeansOfPayment } from '../../utils/paymentMethod'
import { session } from '../../utils/session'

type AddPaymentMethod = ComponentProps & {
  onUpdate: () => void,
  view: 'buyer' | 'seller'
}

export default ({ style, onUpdate, view }: AddPaymentMethod): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onRestore = () => {
    const meansOfPayment = session.unsavedPaymentData!.reduce(dataToMeansOfPayment, {} as MeansOfPayment)

    updateOverlay({
      content: <SetPaymentDetails
        meansOfPayment={meansOfPayment}
        restoredPaymentData={session.unsavedPaymentData}
        onConfirm={() => {}}
      />,
      showCloseIcon: true,
      showCloseButton: false
    })
  }
  const onPaymentMethodSelect = (meansOfPayment: MeansOfPayment) => updateOverlay({
    content: <SetPaymentDetails meansOfPayment={meansOfPayment} onConfirm={onUpdate} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const onCurrencySelect = (currencies: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const openCurrencySelect = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} view={view} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const addPaymentMethods = () => {
    // TODO check if restore payment data will be reimplemented, if not delete logic and templates for good
    // if (session.unsavedPaymentData) {
    //   updateOverlay({
    //     content: <RestorePaymentData
    //       paymentData={session.unsavedPaymentData}
    //       onConfirm={onRestore}
    //       onCancel={openCurrencySelect}
    //     />,
    //     showCloseIcon: true,
    //     showCloseButton: false
    //   })
    // } else {
    //   openCurrencySelect()
    // }
    openCurrencySelect()
  }

  return <View style={style}>
    <View style={tw`flex items-center`}>
      <Pressable testID="add-mop" onPress={addPaymentMethods} style={tw`flex flex-row items-center`}>
        <Icon id="plus" style={tw`w-7 h-7 mr-2`} color={tw`text-peach-1`.color as string} />
        <Text style={tw`text-peach-1 font-baloo text-sm`}>{i18n('paymentMethod.select')}</Text>
      </Pressable>
    </View>
  </View>
}