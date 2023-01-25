import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PrimaryButton } from '../../../components'
import { SlideToUnlock } from '../../../components/inputs'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type ContractCTAProps = ComponentProps & {
  view?: ContractViewer
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
  style,
}: ContractCTAProps): ReactElement => (
  <View style={[tw`w-full items-center`, style]}>
    {view === 'buyer' && requiredAction === 'confirmPayment' && (
      <PrimaryButton disabled iconId="send">
        {i18n('contract.payment.sent')}
      </PrimaryButton>
    )}
    {view === 'seller' && requiredAction === 'sendPayment' && (
      <PrimaryButton disabled iconId="watch">
        {i18n('contract.payment.notYetSent')}
      </PrimaryButton>
    )}
    {view === 'buyer' && requiredAction === 'sendPayment' && (
      <SlideToUnlock
        style={tw`w-[260px]`}
        disabled={loading}
        onUnlock={postConfirmPaymentBuyer}
        label1={i18n('contract.payment.confirm')}
        label2={i18n('contract.payment.made')}
      />
    )}
    {view === 'seller' && requiredAction === 'confirmPayment' && (
      <SlideToUnlock
        style={tw`w-[260px]`}
        disabled={loading}
        onUnlock={postConfirmPaymentSeller}
        label1={i18n('contract.payment.confirm')}
        label2={i18n('contract.payment.received')}
      />
    )}
  </View>
)
