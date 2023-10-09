import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Header, HorizontalLine, PeachScrollView, Screen, Text } from '..'
import { useNavigation, usePreviousRouteName, useRoute, useShowHelp, useToggleBoolean } from '../../hooks'
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
import { NewButton as Button } from '../buttons/Button'
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
  const origin = usePreviousRouteName()
  const [isEditing, toggleIsEditing] = useToggleBoolean(origin === 'settings')
  const tabs: TabbedNavigationItem[] = [
    { id: 'online', display: i18n('paymentSection.online') },
    { id: 'meetups', display: i18n('paymentSection.meetups') },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  return (
    <Screen header={<PaymentMethodsHeader isEditing={isEditing} toggleIsEditing={toggleIsEditing} />}>
      <PeachScrollView style={tw`h-full mb-4`} contentContainerStyle={[tw`pb-10 grow`, tw.md`pb-16`]}>
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
      {origin !== 'settings' && <NextButton />}
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

function NextButton () {
  const navigation = useNavigation()
  const setPopup = usePopupStore((state) => state.setPopup)
  const showHelp = () => setPopup(<InfoPopup content={<Text>{i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')}</Text>} />)
  const origin = usePreviousRouteName()
  const [isStepValid, paymentMethods] = useOfferPreferences(
    (state) => [state.canContinue.paymentMethods, Object.values(state.meansOfPayment).flat()],
    shallow,
  )
  const { data: paymentMethodInfo } = useUserPaymentMethodInfo()

  const goToSummary = () => {
    const flow = origin === 'premium' ? 'sell' : 'buy'
    const forbiddenPaymentMethdos = intersect(paymentMethodInfo.forbidden[flow], paymentMethods)
    if (forbiddenPaymentMethdos.length) {
      const paymentMethod = forbiddenPaymentMethdos.pop()
      if (paymentMethod === 'paypal') showHelp()
      return
    }
    navigation.navigate(flow === 'sell' ? 'sellSummary' : 'buySummary')
  }

  return (
    <Button style={tw`self-center`} disabled={!isStepValid} onPress={goToSummary}>
      {i18n('next')}
    </Button>
  )
}
