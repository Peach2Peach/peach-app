import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import { getDateToDisplay } from '../../../../utils/date/getDateToDisplay'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & {
  creationDate: Date
}

export const AccountCreated = ({ creationDate, style }: Props) => (
  <View style={style}>
    <PeachText style={tw`lowercase text-black-65`}>{i18n('profile.accountCreated')}:</PeachText>
    <PeachText style={tw`subtitle-1`}>{getDateToDisplay(creationDate)}</PeachText>
  </View>
)
