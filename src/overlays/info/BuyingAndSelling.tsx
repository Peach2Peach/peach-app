import React from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const BuyingAndSelling = () => (
  <Text>
    {i18n('help.buyingAndSelling.description.1')}
    {'\n\n'}
    {i18n('help.buyingAndSelling.description.2')}
  </Text>
)
