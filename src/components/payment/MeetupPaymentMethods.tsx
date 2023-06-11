import { View } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { isValidPaymentData } from '../../utils/paymentMethod'
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

type Props = {
  isEditing: boolean
  editItem: (data: PaymentData) => void
  select: (value: string) => void
  isSelected: (item: { value: string }) => boolean
}

export const MeetupPaymentMethods = ({ isEditing, editItem, select, isSelected }: Props) => {
  const { paymentData } = account
  return (
    <>
      {paymentData.filter((item) => isCashTrade(item.type)).length !== 0 && (
        <LinedText style={tw`pb-3`}>
          <Text style={tw`mr-1 h6 text-black-2`}>{i18n('paymentSection.meetups')}</Text>
          <Icon color={tw`text-black-2`.color} id={'users'} />
        </LinedText>
      )}
      {paymentData
        .filter((item) => !item.hidden)
        .filter((item) => isCashTrade(item.type))
        .map(mapPaymentDataToCheckboxes)
        .map((item, i) => (
          <View key={item.data.id} style={i > 0 ? tw`mt-4` : {}}>
            <PaymentDetailsCheckbox
              testID="payment-details-checkbox"
              onPress={() => (isEditing ? editItem(item.data) : select(item.value))}
              item={item}
              checked={isSelected(item)}
              editing={isEditing}
            />
            <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
          </View>
        ))}
    </>
  )
}
