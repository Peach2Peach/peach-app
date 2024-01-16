import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const Trades = ({ trades, style }: { trades: number } & ComponentProps) => (
  <View style={style}>
    <PeachText style={tw`lowercase text-black-65`}>{i18n('profile.numberOfTrades')}:</PeachText>
    <PeachText style={tw`subtitle-1`}>{trades}</PeachText>
  </View>
)
