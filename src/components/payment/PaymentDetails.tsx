import React, { ReactElement, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import { PAYMENTCATEGORIES } from '../../constants'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { account, getPaymentData, removePaymentData, updateSettings } from '../../utils/account'
import { isDefined } from '../../utils/array/isDefined'
import i18n from '../../utils/i18n'
import { dataToMeansOfPayment, getPaymentMethodInfo, isValidPaymentData } from '../../utils/paymentMethod'
import { PaymentDetailsCheckbox, CheckboxType } from './PaymentDetailsCheckbox'
import LinedText from '../ui/LinedText'
import { TabbedNavigation, TabbedNavigationItem } from '../navigation/TabbedNavigation'
import { sessionStorage } from '../../utils/session'
import { useFocusEffect } from '@react-navigation/native'

const paymentCategoryIcons: Record<PaymentCategory, IconType | ''> = {
  bankTransfer: 'inbox',
  onlineWallet: 'cloud',
  giftCard: 'creditCard',
  localOption: 'flag',
  cash: '',
  cryptoCurrency: '',
}

const tabs: TabbedNavigationItem[] = [
  {
    id: 'remote',
    display: i18n('paymentSection.remote'),
  },
  {
    id: 'meetups',
    display: i18n('paymentSection.meetups'),
  },
]

const belongsToCategory = (category: PaymentCategory) => (data: PaymentData) =>
  PAYMENTCATEGORIES[category].includes(data.type)

const getSelectedPaymentDataIds = (preferredMoPs: Settings['preferredPaymentMethods']) =>
  (Object.keys(preferredMoPs) as PaymentMethod[]).reduce((arr: string[], type: PaymentMethod) => {
    const id = preferredMoPs[type]
    if (!id) return arr
    return arr.concat(id)
  }, [])

type PaymentDataKeyFactsProps = ComponentProps & {
  paymentData: PaymentData
}
const PaymentDataKeyFacts = ({ paymentData, style }: PaymentDataKeyFactsProps) => (
  <View style={[tw`flex-row justify-center`, style]}>
    {(paymentData.currencies || []).map((currency) => (
      <View style={[tw`justify-center px-1 mx-1 border rounded-lg border-black-1`, style]}>
        <Text style={[tw`button-medium text-black-1`]}>{currency}</Text>
      </View>
    ))}
  </View>
)

type PaymentDetailsProps = ComponentProps & {
  paymentData: PaymentData[]
  setMeansOfPayment: React.Dispatch<React.SetStateAction<Offer['meansOfPayment']>> | (() => void)
  editing: boolean
}
export default ({ setMeansOfPayment, editing, style }: PaymentDetailsProps): ReactElement => {
  const [, setRandom] = useState(0)
  const navigation = useNavigation()
  const selectedPaymentData = getSelectedPaymentDataIds(account.settings.preferredPaymentMethods)
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [paymentData, setPaymentData] = useState(account.paymentData)

  const cashPaymentData: PaymentData[] = paymentData.filter((item) => item.type === 'cashTrade')

  useFocusEffect(() => {
    setPaymentData(account.paymentData)
  })

  const update = () => {
    setMeansOfPayment(
      getSelectedPaymentDataIds(account.settings.preferredPaymentMethods)
        .map(getPaymentData)
        .filter(isDefined)
        .filter((data) => getPaymentMethodInfo(data.type))
        .reduce((mop, data) => dataToMeansOfPayment(mop, data), {}),
    )
  }

  const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
    value: data.id,
    display: <Text style={tw`subtitle-1`}>{data.label}</Text>,
    isValid: isValidPaymentData(data),
    data,
  })

  const setPreferredPaymentMethods = (ids: string[]) => {
    updateSettings(
      {
        preferredPaymentMethods: (ids as PaymentData['id'][]).reduce((obj, id) => {
          const method = paymentData.find((d) => d.id === id)!.type
          obj[method] = id
          return obj
        }, {} as Settings['preferredPaymentMethods']),
      },
      true,
    )
    update()
  }

  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id)
    setRandom(Math.random())
  }

  const editItem = (data: PaymentData) => {
    if (data.type === 'cashTrade') {
      const eventsByCountry: Record<string, MeetupEvent[]> = sessionStorage.getMap('meetupEvents') ?? {}
      const event = eventsByCountry[data.country!].find((value) => value.id === data.id.replace('cash.', ''))
      if (event) {
        navigation.push('meetupScreen', { event, deletable: true })
      }
    } else {
      navigation.push('paymentDetails', {
        paymentData: data,
        origin: ['paymentMethods', {}],
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
    setPreferredPaymentMethods(newValues)
  }

  const isSelected = (itm: CheckboxType) => selectedPaymentData.includes(itm.value as string)

  useEffect(() => {
    update()
  }, [paymentData])

  return (
    <>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      {currentTab.id === 'remote' ? ( // TODO : Extract component into remote
        paymentData.length === 0 ? (
          <Text style={tw`text-center h6 text-black-3`}>{i18n('paymentMethod.empty')}</Text>
        ) : (
          <View style={[tw`px-4`, style]}>
            <View testID={'checkboxes-buy-mops'}>
              {(Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
                .map((category) => ({
                  category,
                  checkboxes: paymentData
                    .filter(belongsToCategory(category))
                    .filter((data) => getPaymentMethodInfo(data.type))
                    .sort((a, b) => (a.id > b.id ? 1 : -1))
                    .map(mapPaymentDataToCheckboxes),
                }))
                .filter(({ checkboxes }) => checkboxes.length)
                .map(({ category, checkboxes }, i) => (
                  <View key={category} style={i > 0 ? tw`mt-8` : {}}>
                    <LinedText style={tw`pb-3`}>
                      <Text style={tw`mr-1 h6 text-black-2`}>{i18n(`paymentCategory.${category}`)}</Text>
                      {paymentCategoryIcons[category] !== '' && (
                        <Icon color={tw`text-black-2`.color} id={paymentCategoryIcons[category] as IconType} />
                      )}
                    </LinedText>
                    {checkboxes.map((item, j) => (
                      <View key={item.data.id} style={j > 0 ? tw`mt-4` : {}}>
                        {item.isValid ? (
                          <View>
                            <PaymentDetailsCheckbox
                              testID={`buy-mops-checkbox-${item.value}`}
                              onPress={() => (editing ? editItem(item.data) : select(item.value))}
                              item={item}
                              checked={isSelected(item)}
                              editing={editing}
                            />
                            <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
                          </View>
                        ) : (
                          <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`font-baloo text-red`}>{item.data.label}</Text>
                            <Pressable onPress={() => deletePaymentData(item.data)} style={tw`w-6 h-6`}>
                              <Icon id="x" style={tw`w-6 h-6`} color={tw`text-peach-1`.color} />
                            </Pressable>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          </View>
        )
      ) : (
        cashPaymentData.map(mapPaymentDataToCheckboxes).map((item, i) => (
          <View key={item.data.id} style={i > 0 ? tw`mt-4` : {}}>
            <PaymentDetailsCheckbox
              onPress={() => (editing ? editItem(item.data) : select(item.value))}
              item={item}
              checked={isSelected(item)}
              editing={editing}
            />
            <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
          </View>
        ))
      )}
    </>
  )
}
