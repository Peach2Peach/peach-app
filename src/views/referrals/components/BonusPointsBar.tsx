import { View } from 'react-native'
import { Progress, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = { balance: number }

export const BonusPointsBar = ({ balance }: Props) => {
  const BARLIMIT = 400

  return (
    <View>
      <Progress
        style={tw`h-3 rounded`}
        backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background`}
        barStyle={tw`border-2 bg-primary-main border-primary-background`}
        percent={balance / BARLIMIT}
      />
      <Text style={tw`pl-2 tooltip text-black-2`}>
        {i18n('referrals.points')}: <Text style={tw`font-bold tooltip text-black-2`}>{balance}</Text>
      </Text>
    </View>
  )
}
