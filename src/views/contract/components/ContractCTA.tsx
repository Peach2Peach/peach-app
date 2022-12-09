import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, PrimaryButton } from '../../../components'
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
      visible: true,
    })
  return (
    <View>
      {!(view === 'buyer' && requiredAction === 'sendPayment')
        && !(view === 'seller' && requiredAction === 'confirmPayment') && (
        <PrimaryButton disabled={true} style={tw`w-52`} narrow>
          {i18n(`contract.waitingFor.${view === 'buyer' ? 'seller' : 'buyer'}`)}
        </PrimaryButton>
      )}
      {view === 'buyer' && requiredAction === 'sendPayment' && (
        <PrimaryButton disabled={loading} style={tw`w-52`} onPress={postConfirmPaymentBuyer} narrow>
          {i18n('contract.payment.made')}
        </PrimaryButton>
      )}
      {view === 'seller' && requiredAction === 'confirmPayment' && (
        <View style={tw`flex-row items-center justify-center pl-11`}>
          <PrimaryButton style={tw`w-52`} disabled={loading} onPress={postConfirmPaymentSeller} narrow>
            {i18n('contract.payment.received')}
          </PrimaryButton>
          <Pressable onPress={openConfirmPaymentHelp} style={tw`p-3`}>
            <Icon id="helpCircle" style={tw`w-5 h-5`} color={tw`text-blue-1`.color} />
          </Pressable>
        </View>
      )}
    </View>
  )
}
