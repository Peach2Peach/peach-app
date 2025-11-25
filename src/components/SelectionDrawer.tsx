import { useRef, type ReactElement } from "react";
import { Animated, TextInput, View } from "react-native";
import { useIsMediumScreen } from "../hooks/useIsMediumScreen";
import { useKeyboardAwareHeight } from "../hooks/useKeyboardAwareHeight";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { Drawer } from "./Drawer";
import { SelectionList } from "./SelectionList";
import { TouchableIcon } from "./TouchableIcon";
import { HorizontalLine } from "./ui/HorizontalLine";

export interface SelectionDrawerItem {
  text: ReactElement;
  onPress: () => void;
  isSelected?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

interface SelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactElement;
  items: SelectionDrawerItem[];
  type?: "radioButton" | "checkbox";
  resetButton?: ReactElement;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SelectionDrawer({
  isOpen,
  onClose,
  title,
  items,
  type = "radioButton",
  resetButton,
  showSearch = false,
  searchQuery = "",
  onSearchChange,
}: SelectionDrawerProps) {
  const HEADER_AND_PADDING = 120; // Space for padding, header text, etc.
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT = isMediumScreen
    ? DRAWER_HEIGHT_LARGE
    : DRAWER_HEIGHT_SMALL;
  const SCROLL_HEIGHT = DRAWER_HEIGHT - HEADER_AND_PADDING;

  const textInputRef = useRef<TextInput>(null);
  const animatedHeight = useKeyboardAwareHeight({
    initialHeight: SCROLL_HEIGHT,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customHeight={DRAWER_HEIGHT}
    >
      <>
        <HorizontalLine />
        {showSearch && onSearchChange && (
          <View style={tw`pt-4 pb-2`}>
            <View
              style={tw`flex-row items-center px-4 py-1 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <TextInput
                ref={textInputRef}
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder={i18n("search")}
                style={tw`flex-1 px-2 input-text text-black-100`}
                placeholderTextColor={tw.color("black-25")}
              />
              <TouchableIcon
                id="search"
                iconColor={tw.color("black-100")}
                iconSize={20}
                onPress={() => {
                  textInputRef.current?.focus();
                }}
              />
            </View>
          </View>
        )}
        <Animated.ScrollView style={{ height: animatedHeight }}>
          <SelectionList items={items} type={type} />
        </Animated.ScrollView>
        {resetButton}
      </>
    </Drawer>
  );
}
