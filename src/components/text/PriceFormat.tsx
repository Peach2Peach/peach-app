import React, { ReactElement } from 'react'
import { Text } from '.'
import i18n from '../../utils/i18n'

type PriceFormatProps = ComponentProps & {
  amount: number
  currency: Currency
}

export const PriceFormat = ({ amount, currency, style }: PriceFormatProps): ReactElement => {
  const [integer, decimal] = amount.toFixed(2).split('.')

  return <Text style={style}>{i18n(`currency.format.${currency}`, `${integer}.${decimal}`)}</Text>
}

export default PriceFormat
