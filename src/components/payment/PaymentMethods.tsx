import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { shallow } from 'zustand/shallow'
import { fullScreenTabNavigationScreenOptions } from '../../constants'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useNavigation } from '../../hooks/useNavigation'
import { usePreviousRoute } from '../../hooks/usePreviousRoute'
import { useRoute } from '../../hooks/useRoute'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import { getSelectedPaymentDataIds } from '../../utils/account/getSelectedPaymentDataIds'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { Header } from '../Header'
import { PeachScrollView } from '../PeachScrollView'
import { Screen } from '../Screen'
import { useSetPopup } from '../popup/Popup'
import { HorizontalLine } from '../ui/HorizontalLine'
import { AddPaymentMethodButton } from './AddPaymentMethodButton'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'
import { RemotePaymentMethods } from './RemotePaymentMethods'

const PaymentMethodsTab = createMaterialTopTabNavigator()
const tabs = ['online', 'meetups'] as const

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
      navigation.navigate('meetupScreen', {
        eventId: data.id.replace('cash.', ''),
        deletable: true,
        origin: currentRouteName,
      })
    } else {
      navigation.navigate('paymentMethodForm', {
        paymentData: data,
        origin: currentRouteName,
      })
    }
  }

  const isSelected = (itm: { value: string }) => selectedPaymentDataIds.includes(itm.value)
  const { name: origin, params } = usePreviousRoute()
  const isComingFromSettings = origin === 'homeScreen' && params && 'screen' in params && params?.screen === 'settings'
  const [isEditing, toggleIsEditing] = useToggleBoolean(isComingFromSettings)

  return (
    <Screen style={tw`px-0`} header={<PaymentMethodsHeader isEditing={isEditing} toggleIsEditing={toggleIsEditing} />}>
      <PaymentMethodsTab.Navigator
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        {tabs.map((tab) => (
          <PaymentMethodsTab.Screen key={tab} name={tab} options={{ title: `${i18n(`paymentSection.${tab}`)}` }}>
            {() => (
              <PeachScrollView
                style={tw`h-full mb-4`}
                contentContainerStyle={[tw`justify-center pb-10 grow`, tw`md:pb-16`]}
              >
                {tab === 'online' ? (
                  <RemotePaymentMethods {...{ isEditing, editItem, select, isSelected }} />
                ) : (
                  <MeetupPaymentMethods {...{ isEditing, editItem, select, isSelected }} />
                )}
                <HorizontalLine style={tw`m-5`} />
                <AddPaymentMethodButton isCash={tab === 'meetups'} />
              </PeachScrollView>
            )}
          </PaymentMethodsTab.Screen>
        ))}
      </PaymentMethodsTab.Navigator>
    </Screen>
  )
}

type Props = {
  isEditing: boolean
  toggleIsEditing: () => void
}

function PaymentMethodsHeader ({ isEditing, toggleIsEditing }: Props) {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="paymentMethods" />)
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
