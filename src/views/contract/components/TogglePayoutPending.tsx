import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from '../../../components/Icon'
import { Text } from '../../../components/text'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

export const TogglePayoutPending = ({ style }: ComponentProps) => {
  const { showBatchInfo, toggleShowBatchInfo } = useContractContext()

  return (
    <TouchableOpacity
      onPress={toggleShowBatchInfo}
      style={[
        tw`flex-row items-center justify-center px-2 border rounded-lg bg-primary-main border-primary-main`,
        style,
      ]}
    >
      <Text style={tw`button-medium text-primary-background-light`}>
        {i18n(showBatchInfo ? 'contract.summary.tradeDetails' : 'offer.requiredAction.payoutPending')}
      </Text>
      <Icon id="eye" style={tw`w-3 h-3 ml-1 -mt-px`} color={tw`text-primary-background-light`.color} />
    </TouchableOpacity>
  )
}
