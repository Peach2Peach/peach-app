import { useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine, PeachScrollView } from '..'
import { useNavigation, usePreviousRouteName, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import { getSelectedPaymentDataIds } from '../../utils/account'
import i18n from '../../utils/i18n'
import { TabbedNavigation, TabbedNavigationItem } from '../navigation/TabbedNavigation'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'
import { RemotePaymentMethods } from './RemotePaymentMethods'
import { usePaymentMethodsSetup } from './hooks/usePaymentMethodsSetup'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { shallow } from 'zustand/shallow'
import { NextButton } from './components/NextButton'

export const PaymentMethods = () => {
  const navigation = useNavigation()
  const currentRouteName = useRoute().name
  const origin = usePreviousRouteName()
  const tabs: TabbedNavigationItem[] = [
    { id: 'online', display: i18n('paymentSection.online') },
    { id: 'meetups', display: i18n('paymentSection.meetups') },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  const isEditing = usePaymentMethodsSetup()

  const [preferredPaymentMethods, select] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.selectPaymentMethod],
    shallow,
  )
  const selectedPaymentDataIds = getSelectedPaymentDataIds(preferredPaymentMethods)

  const editItem = (data: PaymentData) => {
    if (isCashTrade(data.type)) {
      navigation.push('meetupScreen', {
        eventId: data.id.replace('cash.', ''),
        deletable: true,
        origin: currentRouteName,
      })
    } else {
      navigation.push('paymentMethodForm', {
        paymentData: data,
        origin: currentRouteName,
      })
    }
  }

  const isSelected = (itm: { value: string }) => selectedPaymentDataIds.includes(itm.value)

  return (
    <View style={tw`items-center flex-shrink h-full p-5 pb-7`}>
      <PeachScrollView style={[tw`flex-shrink h-full mb-10`]}>
        <View style={tw`mt-4`}>
          <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
          <PeachScrollView
            style={tw`flex-shrink h-full`}
            contentContainerStyle={tw`justify-center flex-grow px-6 pb-10 pt-7`}
          >
            {currentTab.id === 'online' ? (
              <RemotePaymentMethods {...{ isEditing, editItem, select, isSelected }} />
            ) : (
              <MeetupPaymentMethods {...{ isEditing, editItem, select, isSelected }} />
            )}
            <HorizontalLine style={tw`w-auto m-5`} />
            <AddPaymentMethodButton isCash={currentTab.id === 'meetups'} />
          </PeachScrollView>
        </View>
      </PeachScrollView>
      {origin !== 'settings' && <NextButton />}
    </View>
  )
}
