import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import tw from "../styles/tailwind";
import { FilterSection } from "./ExpressBuyAdvancedFilters";
import { Icon } from "./Icon";
import { PeachText } from "./text/PeachText";

interface SectionProps {
  section: { id: FilterSection; label: string };
  isExpanded: boolean;
  toggleSection: (section: FilterSection) => void;
  children: ReactNode;
}

export function Section({
  section,
  isExpanded,
  toggleSection,
  children,
}: SectionProps) {
  return (
    <>
      <TouchableOpacity
        style={[
          tw`flex-row items-center justify-between px-4 rounded-full py-6px`,
          isExpanded && tw`bg-primary-background-dark-color`,
        ]}
        onPress={() => toggleSection(section.id)}
      >
        <PeachText
          style={tw`text-base font-extrabold tracking-widest uppercase grow font-baloo`}
        >
          {section.label}
        </PeachText>

        <Icon
          id={isExpanded ? "chevronUp" : "chevronDown"}
          size={24}
          color={tw.color("black-100")}
        />
      </TouchableOpacity>

      {isExpanded && children}
    </>
  );
}
