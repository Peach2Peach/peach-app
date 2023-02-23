import tw from '../../styles/tailwind'
import { TextStyle, ViewStyle } from 'react-native'

type SpecialTemplate = {
  style: ViewStyle
  button?: {
    textColor: TextStyle
    bgColor: ViewStyle
  }
}
export const specialTemplates: Partial<Record<PaymentMethod, SpecialTemplate>> = {
  'cash.amsterdam': {
    style: {
      backgroundColor: '#FF9500',
    },
    button: {
      textColor: tw`text-[#FF9500]`,
      bgColor: tw`bg-primary-background-light`,
    },
  },
  'cash.belgianEmbassy': {
    style: {
      backgroundColor: '#FFF9F6',
    },
  },
  'cash.lugano': {
    style: {
      backgroundColor: '#041E69',
    },
  },
}
