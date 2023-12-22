import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const Disputes = ({ opened, won, lost, resolved, style }: User['disputes'] & ComponentProps) => (
  <View style={style}>
    <PeachText style={tw`lowercase body-m text-black-65`}>{i18n('profile.disputes')}:</PeachText>
    <View style={tw`flex-row`}>
      {[opened, won, lost, resolved].map((value, index) => (
        <PeachText key={`myProfile-disputes-${index}`} style={tw`pr-4 lowercase subtitle-1`}>
          {value} {i18n(`profile.disputes${['Opened', 'Won', 'Lost', 'Resolved'][index]}`)}
        </PeachText>
      ))}
    </View>
  </View>
)
