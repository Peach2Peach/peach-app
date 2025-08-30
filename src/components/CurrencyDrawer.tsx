import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { shallow } from "zustand/shallow";
import { useIsMediumScreen } from "../hooks/useIsMediumScreen";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";
import { uniqueArray } from "../utils/array/uniqueArray";
import i18n from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import { TouchableIcon } from "./TouchableIcon";
import { PeachText } from "./text/PeachText";
import { HorizontalLine } from "./ui/HorizontalLine";

interface CurrencyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyDrawer({ isOpen, onClose }: CurrencyDrawerProps) {
  const DRAG_THRESHOLD = 5;
  const CLOSE_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 0.5;
  const HORIZONTAL_THRESHOLD = 50;
  const HEADER_AND_PADDING = 120; // Space for padding, header text, etc.
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT = isMediumScreen
    ? DRAWER_HEIGHT_LARGE
    : DRAWER_HEIGHT_SMALL;
  const SCROLL_HEIGHT = DRAWER_HEIGHT - HEADER_AND_PADDING;

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

  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  );

  const { data: paymentMethods } = usePaymentMethods();
  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ?.reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
        .filter(uniqueArray),
    [paymentMethods],
  );
  if (!modalVisible || !allCurrencies) return null;

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
              <View style={tw`flex-row mb-4`}>
                <Placeholder style={tw`w-6 h-6`} />
                <PeachText
                  style={tw`text-base font-extrabold tracking-widest text-center uppercase grow font-baloo`}
                  suppressHighlighting={true}
                  {...panResponder.panHandlers}
                >
                  {i18n("currencies")}
                </PeachText>
                <TouchableIcon
                  id="x"
                  onPress={handleClose}
                  iconColor={tw.color(
                    isDarkMode ? "backgroundLight-light" : "black-100",
                  )}
                />
              </View>
              <HorizontalLine />
              <ScrollView style={{ maxHeight: SCROLL_HEIGHT }}>
                <View style={tw`gap-4 pt-4`}>
                  {allCurrencies
                    .sort((a, b) =>
                      i18n(`currency.${a}`).localeCompare(
                        i18n(`currency.${b}`),
                      ),
                    )
                    .map((currency, index) => (
                      <Fragment key={`currency-selector-${currency}`}>
                        <TouchableOpacity
                          style={tw`flex-row items-center justify-between px-4 py-px`}
                          onPress={() => setDisplayCurrency(currency)}
                        >
                          <PeachText style={tw`input-title`}>
                            {`${i18n(`currency.${currency}`)} (${currency})`}
                          </PeachText>
                          <Icon
                            id={
                              currency === displayCurrency
                                ? "radioSelected"
                                : "circle"
                            }
                            style={tw`w-4 h-4`}
                            color={tw.color(
                              currency === displayCurrency
                                ? "primary-main"
                                : "black-50",
                            )}
                          />
                        </TouchableOpacity>
                        {index < allCurrencies.length - 1 && <HorizontalLine />}
                      </Fragment>
                    ))}
                </View>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
}
