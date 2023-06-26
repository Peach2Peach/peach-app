import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getDateToDisplay } from '../../../../utils/date'

export const AccountCreated = ({ creationDate, style }: { creationDate: Date } & ComponentProps) => (
  <View style={style}>
    <Text style={tw`lowercase body-m text-black-2`}>{i18n('profile.accountCreated')}:</Text>
    <Text style={tw`subtitle-1`}>{getDateToDisplay(creationDate)}</Text>
  </View>
)
