import { Style } from 'twrnc/dist/esm/types'
import tw from '../../styles/tailwind'
import { ViewStyle } from 'react-native'

type SpecialTemplate = {
  style: ViewStyle
  button?: {
    textColor: Style
    bgColor: Style
  }
}
export const specialTemplates: Partial<Record<PaymentMethod, SpecialTemplate>> = {
  'cash.amsterdam': {
    style: {
      backgroundColor: '#FF9500',
    },
    button: {
      textColor: tw`text-[#FF9500]`,
      bgColor: tw`bg-white-1`,
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
