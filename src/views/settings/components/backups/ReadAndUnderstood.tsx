import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Text } from '../../../../components'
import { Checkbox } from './Checkbox'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & {
  checkBoxProps: {
    checked: boolean
    onPress: () => void
  }
}

export const ReadAndUnderstood = ({ style, checkBoxProps }: Props): ReactElement => (
  <View style={[tw`flex-row items-center`, style]}>
    <Checkbox {...checkBoxProps} />
    <Text style={tw`subtitle-1 pl-2`}>{i18n('settings.backups.seedPhrase.readAndUnderstood')}</Text>
  </View>
)
