import { useEffect, useState, Dispatch, SetStateAction, useCallback } from 'react'
import { View } from 'react-native'
import { HorizontalLine, PeachScrollView } from '..'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { account, getPaymentData } from '../../utils/account'
import { isDefined } from '../../utils/array/isDefined'
import i18n from '../../utils/i18n'
import { dataToMeansOfPayment, getPaymentMethodInfo } from '../../utils/paymentMethod'
import { CheckboxType } from './PaymentDetailsCheckbox'
import { TabbedNavigation, TabbedNavigationItem } from '../navigation/TabbedNavigation'
import { useFocusEffect } from '@react-navigation/native'
import AddPaymentMethodButton from './AddPaymentMethodButton'
import { useSettingsStore } from '../../store/settingsStore'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { MeetupPaymentDetails } from './MeetupPaymentDetails'
import { RemotePaymentDetails } from './RemotePaymentDetails'

const getSelectedPaymentDataIds = (preferredMoPs: Settings['preferredPaymentMethods']) =>
  (Object.keys(preferredMoPs) as PaymentMethod[]).reduce((arr: string[], type: PaymentMethod) => {
    const id = preferredMoPs[type]
    if (!id) return arr
    return arr.concat(id)
  }, [])

type PaymentDetailsProps = ComponentProps & {
  setMeansOfPayment?: Dispatch<SetStateAction<Offer['meansOfPayment']>> | ((meansOfPayment: MeansOfPayment) => void)
  editing: boolean
  origin: keyof RootStackParamList
}
export const PaymentDetails = ({ setMeansOfPayment, editing, style, origin }: PaymentDetailsProps) => {
  const tabs: TabbedNavigationItem[] = [
    { id: 'remote', display: i18n('paymentSection.remote') },
    { id: 'meetups', display: i18n('paymentSection.meetups') },
  ]

  const navigation = useNavigation()
  const preferredPaymentMethods = useSettingsStore((state) => state.preferredPaymentMethods)
  const selectedPaymentData = getSelectedPaymentDataIds(preferredPaymentMethods)
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [paymentData, setPaymentData] = useState(account.paymentData)
  const setPreferredPaymentMethods = useSettingsStore((state) => state.setPreferredPaymentMethods)

  useFocusEffect(() => {
    setPaymentData(account.paymentData)
  })

  const update = useCallback(() => {
    if (isDefined(setMeansOfPayment)) {
      setMeansOfPayment(
        getSelectedPaymentDataIds(preferredPaymentMethods)
          .map(getPaymentData)
          .filter(isDefined)
          .filter((data) => getPaymentMethodInfo(data.type))
          .reduce((mop, data) => dataToMeansOfPayment(mop, data), {}),
      )
    }
  }, [preferredPaymentMethods, setMeansOfPayment])

  const setPaymentMethods = (ids: string[]) => {
    const newPreferredPaymentMethods = ids.reduce((obj, id) => {
      const method = paymentData.find((d) => d.id === id)?.type
      if (method) obj[method] = id
      return obj
    }, {} as Settings['preferredPaymentMethods'])
    setPreferredPaymentMethods(newPreferredPaymentMethods)
    update()
  }

  const editItem = (data: PaymentData) => {
    if (isCashTrade(data.type)) {
      navigation.push('meetupScreen', { eventId: data.id.replace('cash.', ''), deletable: true, origin })
    } else {
      navigation.push('paymentDetails', {
        paymentData: data,
        origin,
      })
    }
  }

  const select = (value: string) => {
    let newValues = selectedPaymentData
    if (newValues.includes(value)) {
      newValues = newValues.filter((v) => v !== value)
    } else {
      newValues.push(value)
    }
    setPaymentMethods(newValues)
  }

  const isSelected = (itm: CheckboxType) => selectedPaymentData.includes(itm.value as string)

  useEffect(() => {
    update()
  }, [paymentData, update])

  return (
    <View style={style}>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      <PeachScrollView
        style={tw`flex-shrink h-full`}
        contentContainerStyle={tw`justify-center flex-grow px-6 pb-10 pt-7`}
      >
        {currentTab.id === 'remote' ? (
          <RemotePaymentDetails {...{ paymentData, editing, editItem, select, isSelected }} />
        ) : (
          <MeetupPaymentDetails {...{ paymentData, editing, editItem, select, isSelected }} />
        )}
        <HorizontalLine style={tw`w-auto m-5`} />
        <AddPaymentMethodButton origin={origin} isCash={currentTab.id === 'meetups'} />
      </PeachScrollView>
    </View>
  )
}
