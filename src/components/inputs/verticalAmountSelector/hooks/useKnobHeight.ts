import tw from '../../../../styles/tailwind'

export const useKnobHeight = () => {
  const style = tw.md`h-8`
  if (style.height) return style.height as number
  return tw`h-[22px]`.height as number
}
