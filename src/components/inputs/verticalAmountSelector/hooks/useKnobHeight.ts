import tw from '../../../../styles/tailwind'

export const useKnobHeight = () => {
  const style = tw.md`h-8`
  if (style.height) return Number(style.height)
  return Number(tw`h-[22px]`.height)
}
