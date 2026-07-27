import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Chain } from "../../../../peach-api/src/@types/offer";
import { Icon } from "../../../components/Icon";
import { SelectionDrawer } from "../../../components/SelectionDrawer";
import { PeachText } from "../../../components/text/PeachText";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { Section } from "./Section";

const CHAINS: Chain[] = ["mainchain", "liquid"];

export type ChainState = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

/** Deliberately component state, not the persisted offer preferences: every
 * sell offer starts on mainchain unless the seller opts in again. */
export function useChainState(): ChainState {
  const [chain, setChain] = useState<Chain>("mainchain");
  return { chain, setChain };
}

export function ChainSelector({ chainState }: { chainState: ChainState }) {
  const { chain, setChain } = chainState;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  const items = useMemo(
    () =>
      CHAINS.map((id) => ({
        text: (
          <View style={tw`shrink gap-0.5`}>
            <PeachText style={tw`input-title`}>
              {i18n(`offerPreferences.chain.${id}`)}
            </PeachText>
            <PeachText style={tw`text-black-65 body-s`}>
              {i18n(`offerPreferences.chain.${id}.description`)}
            </PeachText>
          </View>
        ),
        onPress: () => {
          setChain(id);
          setIsDrawerOpen(false);
        },
        isSelected: id === chain,
      })),
    [chain, setChain],
  );

  return (
    <Section.Container
      style={tw`${isDarkMode ? "bg-card" : "bg-primary-background-dark-color"}`}
    >
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Section.Title>{i18n("offerPreferences.chain")}</Section.Title>
        <TouchableOpacity
          style={tw`flex-row items-center gap-1`}
          onPress={() => setIsDrawerOpen(true)}
          accessibilityHint={i18n("offerPreferences.chain")}
        >
          <PeachText
            style={[
              tw`subtitle-1`,
              isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
            ]}
          >
            {i18n(`offerPreferences.chain.${chain}`)}
          </PeachText>
          <Icon
            id="chevronDown"
            size={16}
            color={tw.color(isDarkMode ? "backgroundLight-light" : "black-100")}
          />
        </TouchableOpacity>
      </View>

      <SelectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={i18n("offerPreferences.chain")}
        items={items}
        includeFilterAlertToggle={false}
      />
    </Section.Container>
  );
}
