import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Text } from '../../components'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { CurrencyType } from '../../store/offerPreferenes/types'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { defaultCurrencies } from './constants'
import { Currencies } from './Currencies'

type Props = {
  currency: Currency
  setCurrency: (c: Currency) => void
}

const TabBar = ({ state, navigation }: MaterialTopTabBarProps) => {
  const items = state.routes
  const selected = items[state.index].name
  const select = navigation.navigate
  const colors = {
    text: tw`text-black-2`,
    textSelected: tw`text-black-1`,
    underline: tw`bg-black-1`,
  }

  return (
    <View style={tw`flex-row justify-center gap-4`}>
      {items.map((item) => (
        <TouchableOpacity style={tw`flex-shrink`} key={item.key + item.name} onPress={() => select(item)}>
          <Text
            style={[
              tw`px-4 py-2 text-center capitalize input-label`,
              item.name === selected ? colors.textSelected : colors.text,
            ]}
          >
            {i18n(item.name)}
          </Text>
          {item.name === selected && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
        </TouchableOpacity>
      ))}
    </View>
  )
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
      <CurrencyTab.Screen name="other" children={() => <Currencies type="other" {...props} />} />
    </CurrencyTab.Navigator>
  )
}
