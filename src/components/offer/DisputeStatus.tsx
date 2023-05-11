import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '../text'

export const DisputeStatus = ({ winner, view }: { winner: 'buyer' | 'seller'; view: 'buyer' | 'seller' }) => {
  const hasWon = winner === view
  return (
    <>
      <View style={tw`flex-row items-center my-2`}>
        <Text style={tw`text-black-3 w-18`}>{i18n('contract.summary.status')}</Text>
        <Text style={tw`mx-2 subtitle-2`}>{i18n(hasWon ? 'contract.disputeWon' : 'contract.disputeLost')}</Text>
        <Icon
          id={hasWon ? 'checkCircle' : 'xCircle'}
          color={hasWon ? tw`text-success-main`.color : tw`text-error-main`.color}
          style={tw`w-4 h-4`}
        />
      </View>
      <Text style={tw`body-s`}>{i18n(`contract.${hasWon ? 'disputeWon' : 'disputeLost'}.${view}.text`)}</Text>
    </>
  )
}
