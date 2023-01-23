import React, { ReactElement } from 'react'
import { Text } from '.'
import i18n from '../../utils/i18n'
import { priceFormat } from '../../utils/string'

type PriceFormatProps = ComponentProps & {
  amount: number
  currency: Currency
}

export const PriceFormat = ({ amount, currency, style }: PriceFormatProps): ReactElement => (
  <Text style={style}>{i18n(`currency.format.${currency}`, `${priceFormat(amount)}`)}</Text>
)

export default PriceFormat
