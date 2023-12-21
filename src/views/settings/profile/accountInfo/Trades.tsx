import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const Trades = ({ trades, style }: { trades: number } & ComponentProps) => (
  <View style={style}>
    <PeachText style={tw`body-m text-black-2 lowercase`}>{i18n('profile.numberOfTrades')}:</PeachText>
    <PeachText style={tw`subtitle-1`}>{trades}</PeachText>
  </View>
)
