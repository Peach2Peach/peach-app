import React, { FC, ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { HorizontalLine, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import satispay from '../components/payment/logos/satispay.svg'
import mbWay from '../components/payment/logos/mbWay.svg'
import bizum from '../components/payment/logos/bizum.svg'
import mobilePay from '../components/payment/logos/mobilePay.svg'
import keksPay from '../components/payment/logos/keksPay.svg'
import paylib from '../components/payment/logos/paylib.svg'
import lydia from '../components/payment/logos/lydia.svg'
import { SvgProps } from 'react-native-svg'

type OptionItem = {
  value: PaymentMethod
  display: string
}

type LocalOptionsProps = {
  local: OptionItem[]
  onSelect: (localOption: PaymentMethod) => void
}

const icons: Record<string, FC<SvgProps>> = {
  satispay,
  mbWay,
  bizum,
  mobilePay,
  keksPay,
  paylib,
  lydia,
}

export const LocalOptionsSelect = ({ local, onSelect }: LocalOptionsProps): ReactElement => (
  <View>
    {local.map((localOption: OptionItem) => {
      const SVG = icons[localOption.value]
      return (
        <Pressable key={localOption.value} onPress={() => onSelect(localOption.value)}>
          <View style={tw`flex flex-row items-center px-8`}>
            {SVG ? <SVG style={[tw`w-8 h-8 mr-4`]} /> : <Text>❌</Text>}
            <Text style={tw`flex-shrink w-full subtitle-1`}>
              {i18n(`paymentMethod.${localOption.value}`).toLowerCase()}
            </Text>
          </View>
          <HorizontalLine style={tw`my-6`} />
        </Pressable>
      )
    })}
  </View>
)
