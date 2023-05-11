import { View } from 'react-native'
import { CurrencySelection } from '../../../components/navigation/CurrencySelection'
import tw from '../../../styles/tailwind'

export const CurrencySelections = () => (
  <View style={tw`gap-4`}>
    <CurrencySelection currencies={['EUR']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF']} selected="EUR" select={() => {}} />
    <CurrencySelection currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN']} selected="EUR" select={() => {}} />
    <CurrencySelection
      currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD']}
      selected="EUR"
      select={() => {}}
    />
    <CurrencySelection
      currencies={['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD', 'RON']}
      selected="EUR"
      select={() => {}}
    />
  </View>
)
