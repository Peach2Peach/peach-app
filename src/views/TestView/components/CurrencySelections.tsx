import { View } from 'react-native'
import { CurrencySelection } from '../../../components/navigation/CurrencySelection'
import tw from '../../../styles/tailwind'

export const CurrencySelections = () => (
  <View style={tw`gap-4`}>
    <CurrencySelection currencies={['EUR']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF']} selected="CHF" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP']} selected="GBP" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK']} selected="SEK" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK']} selected="NOK" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF']} selected="CHF" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN']} selected="GBP" select={() => {}} />
    <CurrencySelection
      currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD']}
      selected="SEK"
      select={() => {}}
    />
    <CurrencySelection
      currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD', 'RON']}
      selected="EUR"
      select={() => {}}
    />
  </View>
)
