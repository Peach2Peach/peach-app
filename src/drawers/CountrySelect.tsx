import React, { ReactElement, useEffect, useState } from 'react'
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
  const [selected, setSelected] = useState<FlagType>()

  const select = (country: FlagType) => {
    setSelected(country)
    onSelect(country)
  }

  useEffect(() => {
    setSelected(selectedCountry)
  }, [])

  return (
    <View>
      {countries.map((country, i) => (
        <View key={country}>
          <View style={tw`flex flex-row items-center px-8`}>
            <Flag id={country} style={tw`w-8 h-8 mr-4 overflow-hidden`} />
            <Text style={tw`font-baloo text-base uppercase w-full flex-shrink`} onPress={() => select(country)}>
              {i18n(`country.${country}`)}
            </Text>
            {country === selected ? (
              <Icon id="check" style={tw`w-7 h-7`} color={tw`text-peach-1`.color as string} />
            ) : null}
          </View>
          {i < countries.length - 1 ? <HorizontalLine style={tw`my-6`} /> : null}
        </View>
      ))}
    </View>
  )
}
