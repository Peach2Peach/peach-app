import React, { ReactElement } from 'react'
import tw from '../../../../styles/tailwind'
import { Text } from '../../../../components'

type Props = ComponentProps & {
  word: string
  index: number
}

export const Word = ({ word, index, style }: Props): ReactElement => (
  <Text style={[tw`px-4 py-3 mb-2 border border-black-2 rounded-xl`, style]}>
    {index}. {word}
  </Text>
)
