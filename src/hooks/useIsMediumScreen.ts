import { useWindowDimensions } from 'react-native'

export const useIsMediumScreen = () => {
  const { width, height } = useWindowDimensions()
  return width > 375 && height > 690
}
