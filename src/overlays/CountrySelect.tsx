import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, HorizontalLine, Icon, PeachScrollView, Text } from '../components'
import i18n from '../utils/i18n'
import { LOCALPAYMENTMETHODS } from '../constants'
import { account, updateSettings } from '../utils/account'

type CountrySelectProps = {
  currency: Currency,
  onConfirm: () => void
}

// TODO add search
export default ({ currency, onConfirm }: CountrySelectProps): ReactElement => {
  const [country, setCountry] = useState(account.settings.country)

  const select = (c: string) => {
    setCountry(c)
  }

  const confirm = () => {
    updateSettings({ country })

    onConfirm()
  }

  return <View style={tw`w-full h-full pt-14 pb-8 flex items-center justify-between`}>
    <View style={tw`w-full`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('currency.select.title')}
      </Headline>
      <View style={tw`px-10`}>
        <HorizontalLine style={tw`bg-white-1 opacity-50 mt-4`}/>
      </View>
      <PeachScrollView style={tw`px-10`}>
        <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl mt-5`}>
          {i18n('country.EU')}
        </Headline>
        <View style={tw`px-5`}>
          {Object.keys(LOCALPAYMENTMETHODS[currency]!).map((c, i) =>
            <Pressable key={c} onPress={() => select(c)} style={[
              tw`w-full h-10 px-4 flex items-center justify-center border border-white-1 rounded`,
              c === country ? tw`bg-white-1` : {},
              i > 0 ? tw`mt-3` : {}
            ]}>
              <Text style={[tw`font-baloo text-sm`, c === country ? tw`text-peach-1` : tw`text-white-1`]}>
                {i18n(`country.${c}`)}
              </Text>
            </Pressable>
          )}
        </View>
      </PeachScrollView>
    </View>
    <View style={tw`w-full`}>
      <View style={tw`px-10`}>
        <HorizontalLine style={tw`bg-white-1 mt-4`}/>
      </View>
      <View style={tw`w-full mt-10 flex items-center`}>
        <Pressable style={tw`absolute left-0`} onPress={onConfirm}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('confirm')}
          secondary={true}
          onPress={confirm}
          wide={false}
        />
      </View>
    </View>
  </View>
}