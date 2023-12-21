import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'
import { useAddPaymentMethodButtonSetup } from './hooks/useAddPaymentMethodButtonSetup'

type Props = ComponentProps & {
  isCash: boolean
}

export const AddPaymentMethodButton = ({ isCash, style }: Props) => {
  const { addCashPaymentMethods, addPaymentMethods, isLoading } = useAddPaymentMethodButtonSetup()

  return (
    <TouchableOpacity
      onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
      disabled={isCash && isLoading}
      style={[
        tw`flex-row items-center justify-center self-center gap-3 w-full`,
        style,
        isCash && isLoading && tw`opacity-50`,
      ]}
    >
      <Icon id="plusCircle" style={tw`w-7 h-7`} color={tw.color('primary-main')} />
      <PeachText style={tw`h6 text-primary-main  shrink`}>
        {i18n.break(`paymentMethod.select.button.${isCash ? 'cash' : 'remote'}`)}
      </PeachText>
    </TouchableOpacity>
  )
}
