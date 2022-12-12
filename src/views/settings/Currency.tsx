import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Button, SelectorBig, Title } from '../../components'
import { CURRENCIES } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { useAccountStore } from '../../utils/storage/accountStorage'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  const account = useAccountStore()
  const [bitcoinContext, updateBitcoinContext] = useContext(BitcoinContext)
  const { currency } = bitcoinContext

  const setCurrency = (c: Currency) => {
    account.updateSettings({ displayCurrency: c })
    updateBitcoinContext({ currency: c })
  }

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.displayCurrency.subtitle')} />
      <View style={tw`h-full flex-shrink mt-12`}>
        <SelectorBig
          style={tw`mt-2`}
          selectedValue={currency}
          items={CURRENCIES.map((c) => ({ value: c, display: c }))}
          onChange={(c) => setCurrency(c as Currency)}
        />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
