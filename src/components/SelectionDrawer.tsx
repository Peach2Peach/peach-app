import { ScrollView } from "react-native";
import { useIsMediumScreen } from "../hooks/useIsMediumScreen";
import { Drawer } from "./Drawer";
import { SelectionList } from "./SelectionList";
import { HorizontalLine } from "./ui/HorizontalLine";

export interface SelectionDrawerItem {
  text: string;
  onPress: () => void;
  isSelected?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

interface SelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | JSX.Element;
  items: SelectionDrawerItem[];
  type?: "radioButton" | "checkbox";
}

export function SelectionDrawer({
  isOpen,
  onClose,
  title,
  items,
  type = "radioButton",
}: SelectionDrawerProps) {
  const HEADER_AND_PADDING = 120; // Space for padding, header text, etc.
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT = isMediumScreen
    ? DRAWER_HEIGHT_LARGE
    : DRAWER_HEIGHT_SMALL;
  const SCROLL_HEIGHT = DRAWER_HEIGHT - HEADER_AND_PADDING;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customHeight={DRAWER_HEIGHT}
    >
      <>
        <HorizontalLine />
        <ScrollView style={{ maxHeight: SCROLL_HEIGHT }}>
          <SelectionList items={items} type={type} />
        </ScrollView>
      </>
    </Drawer>
  );
}
