import {
  ReactNode,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Modal, PanResponder, Pressable, View } from "react-native";
import { useIsMediumScreen } from "../hooks/useIsMediumScreen";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";
import { Placeholder } from "./Placeholder";
import { TouchableIcon } from "./TouchableIcon";
import { PeachText } from "./text/PeachText";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactElement;
  children: ReactElement;
  showCloseButton?: boolean;
  enableDragToClose?: boolean;
  customHeight?: number;
  headerComponent?: ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  enableDragToClose = true,
  customHeight,
  headerComponent: _headerComponent,
}: DrawerProps) {
  const DRAG_THRESHOLD = 5;
  const CLOSE_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 0.5;
  const HORIZONTAL_THRESHOLD = 50;
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT =
    customHeight ||
    (isMediumScreen ? DRAWER_HEIGHT_LARGE : DRAWER_HEIGHT_SMALL);

  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode } = useThemeStore();

  const handleClose = () => {
    // Start close animation
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: DRAWER_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hide modal and call onClose after animation completes
      setModalVisible(false);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableDragToClose &&
        gestureState.dy > DRAG_THRESHOLD &&
        Math.abs(gestureState.dx) < HORIZONTAL_THRESHOLD,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const velocity = gestureState.vy;

        if (
          gestureState.dy > CLOSE_THRESHOLD ||
          velocity > VELOCITY_THRESHOLD
        ) {
          handleClose();
        } else {
          // Snap back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      translateY.setValue(DRAWER_HEIGHT);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.75,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, overlayOpacity, translateY, DRAWER_HEIGHT]);

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={tw`justify-end flex-1`}>
        <Animated.View
          style={[
            tw`absolute inset-0 bg-black-100`,
            { opacity: overlayOpacity },
          ]}
        />
        <Pressable
          style={tw`absolute inset-0 justify-end`}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              tw`p-6 bg-primary-background-main rounded-t-3xl`,
              isDarkMode && tw`bg-backgroundMain-dark`,
              { transform: [{ translateY }] },
            ]}
          >
            <Pressable>
              {title && (
                <View style={tw`flex-row mb-4`}>
                  <Placeholder style={tw`w-6 h-6`} />
                  <PeachText
                    style={tw`text-base font-extrabold tracking-widest text-center uppercase grow font-baloo`}
                    suppressHighlighting={true}
                    {...(enableDragToClose ? panResponder.panHandlers : {})}
                  >
                    {title}
                  </PeachText>
                  {showCloseButton && (
                    <TouchableIcon
                      id="x"
                      onPress={handleClose}
                      iconColor={tw.color(
                        isDarkMode ? "backgroundLight-light" : "black-100",
                      )}
                    />
                  )}
                </View>
              )}

              {/* Content */}
              {children}
            </Pressable>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
}
