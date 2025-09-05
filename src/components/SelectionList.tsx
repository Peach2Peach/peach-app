import { Fragment } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "../styles/tailwind";
import { Icon } from "./Icon";
import { SelectionDrawerItem } from "./SelectionDrawer";
import { HorizontalLine } from "./ui/HorizontalLine";

interface SelectionListProps {
  items: SelectionDrawerItem[];
  type?: "radioButton" | "checkbox";
}
export function SelectionList({
  items,
  type = "radioButton",
}: SelectionListProps) {
  return (
    <View style={tw`gap-4 py-4`}>
      {items.map((item, index) => (
        <Fragment key={`drawer-item-${index}`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between gap-3 px-4 py-px`}
            onPress={item.onPress}
          >
            {item.text}
            <Icon
              id={
                type === "checkbox"
                  ? item.isSelected
                    ? "checkboxMark"
                    : "square"
                  : item.isSelected
                    ? "radioSelected"
                    : "circle"
              }
              style={tw`w-4 h-4`}
              color={tw.color(item.isSelected ? "primary-main" : "black-50")}
            />
          </TouchableOpacity>
          {index < items.length - 1 && <HorizontalLine />}
        </Fragment>
      ))}
    </View>
  );
}
