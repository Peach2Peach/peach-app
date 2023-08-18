import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from '../../../components/Icon'
import { Text } from '../../../components/text'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

export const TogglePayoutPending = ({ style }: ComponentProps) => {
  const { contract, showBatchInfo, toggleShowBatchInfo } = useContractContext()
  const { disputeActive } = contract

  return (
    <TouchableOpacity
      onPress={toggleShowBatchInfo}
      style={[
        tw`flex-row items-center justify-center px-2 bg-primary-main border rounded-lg border-primary-main`,
        disputeActive && tw`border-error-light`,
        style,
      ]}
    >
      <Text style={[tw`button-medium text-primary-background-light`, disputeActive && tw`text-error-light`]}>
        {i18n(showBatchInfo ? 'contract.summary.tradeDetails' : 'offer.requiredAction.payoutPending')}
      </Text>
      <Icon
        id="eye"
        style={tw`w-3 h-3 ml-1 -mt-px`}
        color={disputeActive ? tw`text-error-light`.color : tw`text-primary-background-light`.color}
      />
    </TouchableOpacity>
  )
}
