import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { MyBadges } from './info/MyBadges'
import { TradingLimit } from './info/TradingLimit'

const PaymentMethodsHelp = (): ReactElement => (
  <>
    <Text>{i18n('help.paymentMethods.description.1')}</Text>
    <View style={tw`flex-row mt-2 items-center`}>
      <View style={tw`flex-shrink`}>
        <Text>{i18n('help.paymentMethods.description.2')}</Text>
      </View>
      <Icon style={tw`w-7 h-7 mx-3`} id="userCheck" color={tw`text-black-1`.color} />
    </View>
  </>
)

const CurrenciesHelp = (): ReactElement => <Text>{i18n('help.currency.description')}</Text>

const ReferralsHelp = (): ReactElement => (
  <>
    <Text style={tw`mb-2`}>{i18n('help.referral.description.1')}</Text>
    <Text>{i18n('help.referral.description.2')}</Text>
  </>
)

type HelpContent = {
  title: Record<HelpType, string>
  content: Record<HelpType, () => ReactElement>
}

export const helpOverlays: HelpContent = {
  title: {
    paymentMethods: i18n('settings.paymentMethods'),
    currencies: i18n('help.currency.title'),
    referrals: i18n('help.referral.title'),
    tradingLimit: i18n('help.tradingLimit.title'),
    myBadges: i18n('peachBadges'),
  },
  content: {
    paymentMethods: PaymentMethodsHelp,
    currencies: CurrenciesHelp,
    referrals: ReferralsHelp,
    tradingLimit: TradingLimit,
    myBadges: MyBadges,
  },
}
