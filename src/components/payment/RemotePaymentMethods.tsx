import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import { PAYMENTCATEGORIES } from '../../constants'
import tw from '../../styles/tailwind'
import { account, removePaymentData } from '../../utils/account'
import i18n from '../../utils/i18n'
import { keys } from '../../utils/object'
import { getPaymentMethodInfo, isValidPaymentData } from '../../utils/paymentMethod'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import LinedText from '../ui/LinedText'
import { PaymentDataKeyFacts } from './components/PaymentDataKeyFacts'
import { PaymentDetailsCheckbox } from './PaymentDetailsCheckbox'

const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
  value: data.id,
  display: <Text style={tw`subtitle-1`}>{data.label}</Text>,
  isValid: isValidPaymentData(data),
  data,
})

const paymentCategoryIcons: Record<PaymentCategory, IconType | ''> = {
  bankTransfer: 'inbox',
  onlineWallet: 'cloud',
  giftCard: 'creditCard',
  nationalOption: 'flag',
  cash: '',
  other: 'shuffle',
}

const belongsToCategory = (category: PaymentCategory) => (data: PaymentData) =>
  PAYMENTCATEGORIES[category].includes(data.type)
  && !(category === 'nationalOption' && data.type === 'mobilePay' && data.currencies[0] === 'DKK')
  && !(category === 'onlineWallet' && data.type === 'mobilePay' && data.currencies[0] === 'EUR')

type Props = {
  isEditing: boolean
  editItem: (data: PaymentData) => void
  select: (value: string) => void
  isSelected: (item: { value: string }) => boolean
}

export const RemotePaymentMethods = ({ isEditing, editItem, select, isSelected }: Props) => {
  const { paymentData } = account
  const [, setRandom] = useState(0)
  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id)
    setRandom(Math.random())
  }
  return paymentData.filter((item) => !isCashTrade(item.type)).length === 0 ? (
    <Text style={tw`text-center h6 text-black-3`}>{i18n('paymentMethod.empty')}</Text>
  ) : (
    <View testID={'checkboxes-buy-mops'}>
      {keys(PAYMENTCATEGORIES)
        .map((category) => ({
          category,
          checkboxes: paymentData
            .filter((item) => !item.hidden)
            .filter((item) => !isCashTrade(item.type))
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
                      onPress={() => (isEditing ? editItem(item.data) : select(item.value))}
                      item={item}
                      checked={isSelected(item)}
                      editing={isEditing}
                    />
                    <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
                  </View>
                ) : (
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`font-baloo text-error-main`}>{item.data.label}</Text>
                    <Pressable onPress={() => deletePaymentData(item.data)} style={tw`w-6 h-6`}>
                      <Icon id="trash" style={tw`w-6 h-6`} color={tw`text-black-2`.color} />
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
    </View>
  )
}
