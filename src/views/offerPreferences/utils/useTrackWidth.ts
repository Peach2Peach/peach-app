import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useIsMediumScreen } from "../../../hooks/useIsMediumScreen";
import { sectionContainerPadding } from "../components/Section";
import { horizontalTrackPadding } from "../components/SliderTrack";

const MEDIUM_SCREEN_PADDING = 16;
const SMALL_SCREEN_PADDING = 8;

export const useTrackWidth = () => {
  const { width } = useWindowDimensions();
  const isMediumScreen = useIsMediumScreen();
  const screenPadding = useMemo(
    () => (isMediumScreen ? MEDIUM_SCREEN_PADDING : SMALL_SCREEN_PADDING),
    [isMediumScreen],
  );
  const trackWidth = useMemo(
    () =>
      width - screenPadding - sectionContainerPadding - horizontalTrackPadding,
    [screenPadding, width],
  );
  return trackWidth;
};
