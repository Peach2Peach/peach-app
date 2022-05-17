
import React, { ReactElement, useContext, useEffect } from 'react'
import { Image, View } from 'react-native'

import { Shadow, Text } from '.'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { thousands } from '../utils/string'
import { mildShadow } from '../utils/layout'
import { marketPrices } from '../utils/peachAPI/public/market'
import BitcoinContext from '../contexts/bitcoin'
import { account } from '../utils/account'

type HeaderProps = ComponentProps

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
export const Header = ({ style }: HeaderProps): ReactElement => {
  const [bitcoinContext, updateBitcoinContext] = useContext(BitcoinContext)

  useEffect(() => {
    const checkingFunction = async () => {
      const [prices] = await marketPrices()

      if (prices) updateBitcoinContext({ prices })
    }
    const interval = setInterval(checkingFunction, 15 * 1000)
    updateBitcoinContext({ currency: account.settings.displayCurrency })
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <View style={style}>
    <Shadow shadow={mildShadow}>
      <View style={tw`w-full flex-row items-center justify-between px-3 py-2 bg-white-1`}>
        <View>
          <Text style={tw`font-lato leading-5 text-grey-1 text-right`}>
            1 Bitcoin
          </Text>
          <Text style={tw`font-lato leading-5 text-peach-1 text-right`}>
            {i18n(`currency.format.${bitcoinContext.currency}`, thousands(Math.round(bitcoinContext.price)))}
          </Text>
        </View>
        <Image source={require('../../assets/favico/peach-logo.png')} style={tw`w-10 h-10`}/>
        <View>
          <Text style={tw`font-lato leading-5 text-grey-1`}>
            1 {bitcoinContext.currency}
          </Text>
          <Text style={tw`font-lato leading-5 text-peach-1`}>
            {i18n('currency.format.sats', String(Math.round(bitcoinContext.satsPerUnit)))}
          </Text>
        </View>
      </View>
    </Shadow>
  </View>
}

export default Header