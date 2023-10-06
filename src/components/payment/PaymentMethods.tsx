import { useState } from 'react'
import { Header, HorizontalLine, PeachScrollView, Screen } from '..'
import { usePreviousRouteName, useShowHelp, useToggleBoolean } from '../../hooks'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { TabbedNavigation, TabbedNavigationItem } from '../navigation/TabbedNavigation'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'
import { RemotePaymentMethods } from './RemotePaymentMethods'
import { NextButton } from './components/NextButton'
import { usePaymentMethodsSetup } from './hooks/usePaymentMethodsSetup'

export const PaymentMethods = () => {
  const { editItem, select, isSelected } = usePaymentMethodsSetup()
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
