import React from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'

export const TitleComponent = ({ page }: { page: 'buy' | 'sell' }) => (
  <Text style={tw`h6`}>
    <Text style={[tw`h6`, page === 'buy' ? tw`text-success-light` : tw`text-primary-main`]}>{page}</Text> bitcoin
  </Text>
)

export default TitleComponent
