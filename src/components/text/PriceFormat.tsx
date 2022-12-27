import React, { ReactElement } from 'react'
import { Text } from '.'
import i18n from '../../utils/i18n'
import { groupChars } from '../../utils/string'

type PriceFormatProps = ComponentProps & {
  amount: number
  currency: Currency
}

export const PriceFormat = ({ amount, currency, style }: PriceFormatProps): ReactElement => {
  const [integer, decimal] = amount.toFixed(2).split('.')

  return <Text style={style}>{i18n(`currency.format.${currency}`, `${groupChars(integer, 3)}.${decimal}`)}</Text>
}

export default PriceFormat
