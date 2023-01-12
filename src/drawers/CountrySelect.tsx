import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { Flag, HorizontalLine, Icon, Text } from '../components'
import { FlagType } from '../components/flags'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type CountryProps = {
  countries: FlagType[]
  selectedCountry?: FlagType
  onSelect: (country: FlagType) => void
}
export const CountrySelect = ({ countries, selectedCountry, onSelect }: CountryProps): ReactElement => {
  const [selected, setSelected] = useState<FlagType>(selectedCountry || countries[0])

  const select = (country: FlagType) => {
    setSelected(country)
  }
  const confirm = () => (selected ? onSelect(selected) : null)

  return (
    <View>
      {countries.map((country, i) => (
        <View key={country}>
          <View style={tw`flex flex-row items-center px-8`}>
            <Flag id={country} style={tw`w-8 h-8 mr-4 overflow-hidden`} />
            <Text style={tw`flex-shrink w-full subtitle-1`} onPress={() => select(country)}>
              {i18n(`country.${country}`)}
            </Text>
            {country === selected ? <Icon id="check" style={tw`w-7 h-7`} color={tw`text-primary-main`.color} /> : null}
          </View>
          {i < countries.length - 1 ? <HorizontalLine style={tw`my-6`} /> : null}
        </View>
      ))}
      <HorizontalLine style={tw`my-6`} />
      <Text onPress={confirm} style={tw`text-center drawer-title text-primary-main`}>
        {i18n('confirm')}
      </Text>
    </View>
  )
}
