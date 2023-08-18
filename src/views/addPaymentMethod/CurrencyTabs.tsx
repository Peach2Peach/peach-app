import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { shallow } from 'zustand/shallow'
import { TabBar } from '../../components/ui/TabBar'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { CurrencyType } from '../../store/offerPreferenes/types'
import { Currencies } from './Currencies'
import { defaultCurrencies } from './constants'

type Props = {
  currency: Currency
  setCurrency: (c: Currency) => void
}

const CurrencyTab = createMaterialTopTabNavigator()

export const CurrencyTabs = (props: Props) => {
  const [preferredCurrencyType, setPreferredCurrencyType] = useOfferPreferences(
    (state) => [state.preferredCurrenyType, state.setPreferredCurrencyType],
    shallow,
  )

  return (
    <CurrencyTab.Navigator
      initialRouteName={preferredCurrencyType.toString()}
      screenListeners={{
        focus: (e) => {
          const currencyType = CurrencyType.parse(e.target?.split('-')[0])
          setPreferredCurrencyType(currencyType)
          props.setCurrency(defaultCurrencies[currencyType])
        },
      }}
      tabBar={TabBar}
    >
      <CurrencyTab.Screen name="europe" children={() => <Currencies type="europe" {...props} />} />
      <CurrencyTab.Screen name="latinAmerica" children={() => <Currencies type="latinAmerica" {...props} />} />
      <CurrencyTab.Screen name="africa" children={() => <Currencies type="africa" {...props} />} />
      <CurrencyTab.Screen name="other" children={() => <Currencies type="other" {...props} />} />
    </CurrencyTab.Navigator>
  )
}
