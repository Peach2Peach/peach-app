import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '../text'

export const DisputeStatus = ({ winner }: { winner: 'buyer' | 'seller' }) => (
  <>
    <View style={tw`flex-row items-center my-2`}>
      <Text style={tw`text-black-3 w-18`}>{i18n('contract.summary.status')}</Text>
      <Text style={tw`mx-2 subtitle-2`}>{i18n('contract.disputeWon')}</Text>
      <Icon id="checkCircle" color={tw`text-success-main`.color} style={tw`w-4 h-4`} />
    </View>
    <Text style={tw`body-s`}>{i18n(`contract.disputeWon.${winner}.text`)}</Text>
  </>
)
