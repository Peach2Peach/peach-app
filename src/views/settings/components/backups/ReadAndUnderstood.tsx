import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { Checkbox, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & { checkBoxProps: { checked: boolean; onPress: () => void } }

export const ReadAndUnderstood = ({ style, checkBoxProps }: Props): ReactElement => (
  <View style={[tw`flex-row items-center`, style]}>
    <Checkbox {...checkBoxProps} />
    <Text style={tw`pl-2 subtitle-1`}>{i18n('settings.backups.seedPhrase.readAndUnderstood')}</Text>
  </View>
)
