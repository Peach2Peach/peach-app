import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const Disputes = ({
  opened,
  won,
  lost,
  style,
}: { won: number; lost: number; opened: number } & ComponentProps) => (
  <View style={style}>
    <Text style={tw`lowercase body-m text-black-2`}>{i18n('profile.disputes')}:</Text>
    <View style={tw`flex-row`}>
      {[opened, won, lost].map((value, index) => (
        <Text key={`myProfile-disputes-${index}`} style={tw`pr-4 lowercase subtitle-1`}>
          {value} {i18n(`profile.disputes${['Opened', 'Won', 'Lost'][index]}`)}
        </Text>
      ))}
    </View>
  </View>
)
