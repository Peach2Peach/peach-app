import { useWindowDimensions } from "react-native";

const MIN_MEDIUM_SCREEN_WIDTH = 375;
const MIN_MEDIUM_SCREEN_HEIGHT = 690;
export const useIsMediumScreen = () => {
  const { width, height } = useWindowDimensions();
  return width >= MIN_MEDIUM_SCREEN_WIDTH && height >= MIN_MEDIUM_SCREEN_HEIGHT;
};
