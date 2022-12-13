import React, { ReactElement, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import shallow from 'zustand/shallow'
import { Icon, Text } from '..'
import { PAYMENTCATEGORIES } from '../../constants'
import { UserDataStore, useUserDataStore } from '../../store'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { dataToMeansOfPayment, getPaymentMethodInfo, isValidPaymentData } from '../../utils/paymentMethod'
import { Item } from '../inputs'
import { CheckboxItem, CheckboxItemType } from '../inputs/Checkboxes'

const belongsToCategory = (category: PaymentCategory) => (data: PaymentData) =>
  PAYMENTCATEGORIES[category].indexOf(data.type) !== -1

const getSelectedPaymentDataIds = (preferredMoPs: Settings['preferredPaymentMethods']) =>
  (Object.keys(preferredMoPs) as PaymentMethod[]).reduce((arr: string[], type: PaymentMethod) => {
    const id = preferredMoPs[type]
    if (!id) return arr
    return arr.concat(id)
  }, [])

const dummy = () => {}

type PaymentDataKeyFactsProps = ComponentProps & {
  paymentData: PaymentData
}
const PaymentDataKeyFacts = ({ paymentData, style }: PaymentDataKeyFactsProps) => (
  <View style={[tw`flex-row justify-center`, style]}>
    {(paymentData.currencies || []).map((currency) => (
      <Item style={tw`h-5 px-1 mx-px`} key={currency} label={currency} isSelected={false} onPress={dummy} />
    ))}
  </View>
)

type PaymentDetailsProps = ComponentProps & {
  editable?: boolean
  navigation?: StackNavigation
  setMeansOfPayment: React.Dispatch<React.SetStateAction<Offer['meansOfPayment']>> | (() => void)
}

const paymentDetailsSelector = (state: UserDataStore) => ({
  preferredPaymentMethods: state.settings.preferredPaymentMethods,
  updateSettings: state.updateSettings,
  paymentData: state.paymentData,
  getWithId: state.getPaymentDataById,
  removePaymentData: state.removePaymentData,
})

export default ({ editable, setMeansOfPayment, navigation, style }: PaymentDetailsProps): ReactElement => {
  const { paymentData, preferredPaymentMethods, getWithId, removePaymentData, updateSettings } = useUserDataStore(
    paymentDetailsSelector,
    shallow,
  )

  const selectedPaymentData = getSelectedPaymentDataIds(preferredPaymentMethods)

  const update = () => {
    setMeansOfPayment(
      getSelectedPaymentDataIds(preferredPaymentMethods)
        .map(getWithId)
        .filter((data) => data)
        .filter((data) => getPaymentMethodInfo(data!.type))
        .reduce((mop, data) => dataToMeansOfPayment(mop, data!), {}),
    )
  }

  const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
    value: data.id,
    display: <Text style={tw`font-baloo text-base`}>{data.label}</Text>,
    isValid: isValidPaymentData(data),
    disabled: editable,
    data,
  })

  const setPreferredPaymentMethods = (ids: string[]) => {
    updateSettings({
      preferredPaymentMethods: (ids as PaymentData['id'][]).reduce((obj, id) => {
        const method = getWithId(id).type
        obj[method] = id
        return obj
      }, {} as Settings['preferredPaymentMethods']),
    })
    update()
  }

  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id)
  }

  const editItem = (data: PaymentData) => {
    navigation!.push('paymentDetails', {
      paymentData: data,
      origin: ['paymentMethods', {}],
    })
  }

  const select = (value: string) => {
    let newValues = selectedPaymentData
    if (newValues.indexOf(value) !== -1) {
      newValues = newValues.filter((v) => v !== value)
    } else {
      newValues.push(value)
    }
    setPreferredPaymentMethods(newValues)
  }

  const isSelected = (itm: CheckboxItemType) => selectedPaymentData.indexOf(itm.value as string) !== -1

  useEffect(() => {
    update()
  }, [paymentData])

  return (
    <View style={[tw`px-4`, style]}>
      <View testID={'checkboxes-buy-mops'}>
        {(Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
          .map((category) => ({
            category,
            checkboxItems: Object.values(paymentData)
              .filter(belongsToCategory(category))
              .filter((data) => getPaymentMethodInfo(data.type))
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map(mapPaymentDataToCheckboxes),
          }))
          .filter(({ checkboxItems }) => checkboxItems.length)
          .map(({ category, checkboxItems }, i) => (
            <View key={category} style={i > 0 ? tw`mt-8` : {}}>
              <Text style={tw`font-baloo text-lg text-center`}>{i18n(`paymentCategory.${category}`)}</Text>
              {checkboxItems.map((item, j) => (
                <View key={item.data.id} style={j > 0 ? tw`mt-4` : {}}>
                  {item.isValid ? (
                    <View>
                      <CheckboxItem
                        testID={`buy-mops-checkbox-${item.value}`}
                        onPress={() => (!editable ? select(item.value) : editItem(item.data))}
                        item={item}
                        checked={isSelected(item)}
                      />
                      <PaymentDataKeyFacts style={tw`mt-2`} paymentData={item.data} />
                    </View>
                  ) : (
                    <View style={tw`flex flex-row justify-between`}>
                      <Text style={tw`font-baloo text-red`}>{item.data.label}</Text>
                      <Pressable onPress={() => deletePaymentData(item.data)} style={tw`w-6 h-6`}>
                        <Icon id="cross" style={tw`w-6 h-6`} color={tw`text-peach-1`.color as string} />
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
}
