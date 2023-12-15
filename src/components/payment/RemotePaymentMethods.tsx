import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { IconType } from '../../assets/icons'
import { PAYMENTCATEGORIES } from '../../paymentMethods'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import { removePaymentData } from '../../utils/account/removePaymentData'
import i18n from '../../utils/i18n'
import { keys } from '../../utils/object/keys'
import { getPaymentMethodInfo } from '../../utils/paymentMethod/getPaymentMethodInfo'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'
import { LinedText } from '../ui/LinedText'
import { PaymentDetailsCheckbox } from './PaymentDetailsCheckbox'
import { PaymentDataKeyFacts } from './components/PaymentDataKeyFacts'

const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
  value: data.id,
  display: <PeachText style={tw`subtitle-1`}>{data.label}</PeachText>,
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
  const paymentData = usePaymentDataStore((state) => state.getPaymentDataArray())
  const [, setRandom] = useState(0)
  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id)
    setRandom(Math.random())
  }
  return paymentData.filter((item) => !isCashTrade(item.type)).length === 0 ? (
    <PeachText style={tw`text-center h6 text-black-3`}>{i18n('paymentMethod.empty')}</PeachText>
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
              <PeachText style={tw`mr-1 h6 text-black-2`}>{i18n(`paymentCategory.${category}`)}</PeachText>
              {paymentCategoryIcons[category] !== '' && (
                <Icon color={tw.color('black-2')} id={paymentCategoryIcons[category] as IconType} />
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
                    <PeachText style={tw`font-baloo text-error-main`}>{item.data.label}</PeachText>
                    <Pressable onPress={() => deletePaymentData(item.data)} style={tw`w-6 h-6`}>
                      <Icon id="trash" style={tw`w-6 h-6`} color={tw.color('black-2')} />
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
