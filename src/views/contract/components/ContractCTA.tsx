import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Button, Icon } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import ConfirmPayment from '../../../overlays/info/ConfirmPayment'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type ContractCTAProps = {
  view: 'buyer' | 'seller' | ''
  requiredAction: ContractAction
  loading: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export default ({
  view,
  requiredAction,
  loading,
  postConfirmPaymentBuyer,
  postConfirmPaymentSeller,
}: ContractCTAProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const openConfirmPaymentHelp = () =>
    updateOverlay({
      content: <ConfirmPayment />,
      showCloseButton: true,
      help: true,
    })
  return (
    <View>
      {!(view === 'buyer' && requiredAction === 'sendPayment')
      && !(view === 'seller' && requiredAction === 'confirmPayment') ? (
          <Button
            disabled={true}
            wide={false}
            style={tw`w-52`}
            title={i18n(`contract.waitingFor.${view === 'buyer' ? 'seller' : 'buyer'}`)}
          />
        ) : null}
      {view === 'buyer' && requiredAction === 'sendPayment' ? (
        <Button
          disabled={loading}
          wide={false}
          style={tw`w-52`}
          onPress={postConfirmPaymentBuyer}
          title={i18n('contract.payment.made')}
        />
      ) : null}
      {view === 'seller' && requiredAction === 'confirmPayment' ? (
        <View style={tw`flex-row items-center justify-center pl-11`}>
          <Button
            style={tw`w-52`}
            disabled={loading}
            wide={false}
            onPress={postConfirmPaymentSeller}
            title={i18n('contract.payment.received')}
          />
          <Pressable onPress={openConfirmPaymentHelp} style={tw`p-3`}>
            <Icon id="helpCircle" style={tw`w-5 h-5`} color={tw`text-blue-1`.color} />
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}
