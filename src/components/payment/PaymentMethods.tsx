import { useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Header, HorizontalLine, PeachScrollView, Screen, Text } from '..'
import { useNavigation, usePreviousRoute, useRoute, useShowHelp, useToggleBoolean } from '../../hooks'
import { useUserPaymentMethodInfo } from '../../hooks/query/useUserPaymentMethodInfo'
import { InfoPopup } from '../../popups/InfoPopup'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { getSelectedPaymentDataIds } from '../../utils/account'
import { intersect } from '../../utils/array'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { isCashTrade } from '../../utils/paymentMethod'
import { TabbedNavigation, TabbedNavigationItem } from '../navigation/TabbedNavigation'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'
import { RemotePaymentMethods } from './RemotePaymentMethods'

export const PaymentMethods = () => {
  const navigation = useNavigation()
  const currentRouteName = useRoute().name
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
  const { name: origin, params } = usePreviousRoute()
  const isComingFromSettings = origin === 'homeScreen' && params && 'screen' in params && params?.screen === 'settings'
  const [isEditing, toggleIsEditing] = useToggleBoolean(isComingFromSettings)
  const tabs: TabbedNavigationItem<'online' | 'meetups'>[] = [
    { id: 'online', display: i18n('paymentSection.online') },
    { id: 'meetups', display: i18n('paymentSection.meetups') },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  return (
    <Screen header={<PaymentMethodsHeader isEditing={isEditing} toggleIsEditing={toggleIsEditing} />}>
      <PeachScrollView style={tw`h-full mb-4`} contentContainerStyle={[tw`pb-10 grow`, tw`md:pb-16`]}>
        <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
        <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`justify-center pt-6 grow`}>
          {currentTab.id === 'online' ? (
            <RemotePaymentMethods {...{ isEditing, editItem, select, isSelected }} />
          ) : (
            <MeetupPaymentMethods {...{ isEditing, editItem, select, isSelected }} />
          )}
          <HorizontalLine style={tw`m-5`} />
          <AddPaymentMethodButton isCash={currentTab.id === 'meetups'} />
        </PeachScrollView>
      </PeachScrollView>
    </Screen>
  )
}

type Props = {
  isEditing: boolean
  toggleIsEditing: () => void
}

function PaymentMethodsHeader ({ isEditing, toggleIsEditing }: Props) {
  const showHelp = useShowHelp('paymentMethods')
  const hasPaymentMethods = usePaymentDataStore((state) => state.getPaymentDataArray().length !== 0)

  return (
    <Header
      title={i18n(isEditing ? 'paymentMethods.edit.title' : 'paymentMethods.title')}
      icons={
        hasPaymentMethods
          ? [
            { ...headerIcons[isEditing ? 'checkbox' : 'edit'], onPress: toggleIsEditing },
            { ...headerIcons.help, onPress: showHelp },
          ]
          : [{ ...headerIcons.help, onPress: showHelp }]
      }
    />
  )
}

// TODO: to be used for publishing buy offers
export const useForbiddenPaymentMethods = (fn?: () => unknown) => {
  const { data: paymentMethodInfo } = useUserPaymentMethodInfo()
  const paymentMethods = useOfferPreferences((state) => Object.values(state.meansOfPayment).flat())

  const forbiddenPaymentMethdos = intersect(paymentMethodInfo.forbidden.buy, paymentMethods)
  const setPopup = usePopupStore((state) => state.setPopup)
  const showHelp = useCallback(
    () => setPopup(<InfoPopup content={<Text>{i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')}</Text>} />),
    [setPopup],
  )

  return useCallback(() => {
    if (forbiddenPaymentMethdos.length) {
      const paymentMethod = forbiddenPaymentMethdos.pop()
      if (paymentMethod === 'paypal') {
        showHelp()
        return null
      }
    }
    return fn && fn()
  }, [forbiddenPaymentMethdos, fn, showHelp])
}
