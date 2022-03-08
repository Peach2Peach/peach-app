
import React, { ReactElement } from 'react'
import {
  View, ViewStyle
} from 'react-native'

import { Text } from '.'
import { Shadow } from 'react-native-shadow-2'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { thousands } from '../utils/string'
import { mildShadow } from '../utils/layoutUtils'

interface HeaderProps {
  bitcoinContext: BitcoinContextType,
  style?: ViewStyle|ViewStyle[]
}

/**
 * @description Component to display the Header
 * @param props Component properties
 * @param props.bitcoinContext the current bitcoin context
 * @param props.bitcoinContext.price current bitcoin price
 * @param props.bitcoinContext.currency current currency
 * @param props.bitcoinContext.satsPerUnit sats for one unit of fiat
 * @example
 * <Header bitcoinContext={bitcoinContext} />
 */
export const Header = ({ bitcoinContext, style }: HeaderProps): ReactElement =>
  <View style={style}>
    <Shadow {...mildShadow}>
      <View style={tw`w-full flex-row items-center justify-between px-3 py-2 bg-white-1`}>
        <View>
          <Text style={tw`font-lato leading-5 text-grey-1 text-right`}>
            Bitcoin
          </Text>
          <Text style={tw`font-lato leading-5 text-peach-1 text-right`}>
            {i18n(`currency.format.${bitcoinContext.currency}`, thousands(Math.round(bitcoinContext.price)))}
          </Text>
        </View>
        <View>
          <Text style={tw`font-lato leading-5 text-grey-1`}>
            {i18n(`currency.${bitcoinContext.currency}`)}
          </Text>
          <Text style={tw`font-lato leading-5 text-peach-1`}>
            {i18n('currency.format.sats', String(Math.round(bitcoinContext.satsPerUnit)))}
          </Text>
        </View>
      </View>
    </Shadow>
  </View>
export default Header