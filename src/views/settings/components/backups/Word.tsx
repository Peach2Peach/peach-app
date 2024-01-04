import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'

type Props = ComponentProps & {
  word: string
  index: number
}

export const Word = ({ word, index, style }: Props) => (
  <PeachText style={[tw`px-4 py-3 mb-2 border border-black-2 rounded-xl`, style]}>
    {index}. {word}
  </PeachText>
)
