import React, { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const UseYourOwnNode = (): ReactElement => (
  <Text>
    {i18n('help.useYourOwnNode.description.1')}
    {'\n\n'}
    {i18n('help.useYourOwnNode.description.2')}
  </Text>
)
