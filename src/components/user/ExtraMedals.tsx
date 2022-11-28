import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { MEDALS } from '../../constants'
import tw from '../../styles/tailwind'
import { diff } from '../../utils/array'
import i18n from '../../utils/i18n'
import { Text } from '../text'

type ExtraMedalsProps = ComponentProps & {
  user: User
  showInactive?: boolean
}

/**
 * @description Component to display a extra user medals
 * @param user the user
 */
export const ExtraMedals = ({ user, style }: ExtraMedalsProps): ReactElement => (
  <View style={style}>
    {user.medals.map((medal) => (
      <Text key={medal} style={tw`text-sm text-peach-1`}>
        {i18n(`medal.${medal}`)}
      </Text>
    ))}
    {diff(MEDALS, user.medals).map((medal) => (
      <Text key={medal} style={tw`text-sm text-grey-4`}>
        {i18n(`medal.${medal}`)}
      </Text>
    ))}
  </View>
)
