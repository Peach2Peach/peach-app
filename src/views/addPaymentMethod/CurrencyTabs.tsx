import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { shallow } from 'zustand/shallow'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { CurrencyType } from '../../store/offerPreferenes/types'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Currencies } from './Currencies'
import { defaultCurrencies } from './constants'

type Props = {
  currency: Currency
  setCurrency: (c: Currency) => void
}

const CurrencyTab = createMaterialTopTabNavigator()

const currencyTabs = ['europe', 'latinAmerica', 'africa', 'other'] as const

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
      screenOptions={{
        tabBarLabelStyle: tw`capitalize input-title`,
        tabBarStyle: tw`bg-transparent`,
        tabBarContentContainerStyle: tw`bg-transparent`,
        tabBarIndicatorStyle: tw`bg-black-1`,
        tabBarItemStyle: tw`px-0`,
        tabBarPressColor: 'transparent',
        tabBarScrollEnabled: true,
      }}
    >
      {currencyTabs.map((currencyTab) => (
        <CurrencyTab.Screen
          key={currencyTab}
          name={currencyTab}
          options={{ title: i18n(currencyTab) }}
          children={() => <Currencies type={currencyTab} {...props} />}
        />
      ))}
    </CurrencyTab.Navigator>
  )
}
