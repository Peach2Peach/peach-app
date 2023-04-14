import tw from '../../styles/tailwind'

export const footerThemes = {
  default: {
    text: tw`text-black-2`,
    textSelected: tw`text-black-1`,
    textSelectedSettings: tw`text-primary-main`,
    bg: tw`bg-primary-background`,
  },
  inverted: {
    text: tw`text-primary-mild-2`,
    textSelected: tw`text-primary-background-light`,
    textSelectedSettings: tw`text-primary-background-light`,
    bg: tw`bg-transparent`,
  },
}
