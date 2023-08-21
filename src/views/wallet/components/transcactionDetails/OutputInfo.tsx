import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { TabBar } from '../../../../components/ui/TabBar'
import tw from '../../../../styles/tailwind'
import { OfferData } from './OfferData'
import { getOfferDataId } from './TransactionDetailsInfo'

const Tab = createMaterialTopTabNavigator()

type OutputInfoProps = {
  transaction: TransactionSummary
  receivingAddress?: string
}
export const OutputInfo = ({ transaction, receivingAddress }: OutputInfoProps) => {
  const { type, offerData, amount } = transaction
  const [tabsHeight, setTabsHeight] = useState(Number(tw`h-30`.height))
  const adjustHeight = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.height) return
    const tabHeight = Math.round(event.nativeEvent.layout.height)
    setTabsHeight((prev) => Math.max(prev, Number(tw`h-12`.height) + tabHeight))
  }
  if (offerData.length > 1) return (
    <Tab.Navigator
      style={[tw`flex-shrink h-40`, { height: tabsHeight }]}
      sceneContainerStyle={tw`mt-4`}
      initialRouteName={getOfferDataId(offerData[0])}
      tabBar={TabBar}
    >
      {offerData.map((offer) => (
        <Tab.Screen
          key={`tab-screen-${getOfferDataId(offer)}`}
          name={getOfferDataId(offer)}
          children={() => <OfferData onLayout={adjustHeight} {...offer} {...{ type, transaction }} />}
        />
      ))}
    </Tab.Navigator>
  )
  if (offerData.length === 1) {
    return <OfferData key={`tab-screen-${getOfferDataId(offerData[0])}`} {...offerData[0]} {...{ type, transaction }} />
  }
  return <OfferData {...{ address: receivingAddress, amount, type, transaction }} />
}
