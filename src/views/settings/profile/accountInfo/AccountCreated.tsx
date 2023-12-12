import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import { getDateToDisplay } from '../../../../utils/date/getDateToDisplay'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & {
  creationDate: Date
}

export const AccountCreated = ({ creationDate, style }: Props) => (
  <View style={style}>
    <Text style={tw`lowercase body-m text-black-2`}>{i18n('profile.accountCreated')}:</Text>
    <Text style={tw`subtitle-1`}>{getDateToDisplay(creationDate)}</Text>
  </View>
)
