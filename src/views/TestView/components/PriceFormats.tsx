import { View } from 'react-native'
import { PriceFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const PriceFormats = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Price Format</Text>
    <PriceFormat amount={1} currency="EUR" />
    <PriceFormat amount={6.15} currency="CHF" />
    <PriceFormat amount={12.5} currency="GBP" />
    <PriceFormat amount={100} currency="USD" />
    <PriceFormat amount={1000} currency="SEK" />
    <PriceFormat amount={10000} currency="EUR" />
    <PriceFormat amount={100000} currency="EUR" />
    <PriceFormat amount={1000000} currency="EUR" />
  </View>
)
