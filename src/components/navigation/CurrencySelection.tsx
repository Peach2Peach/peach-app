import { TouchableOpacity, View } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";

type CurrencySelectionItemProps = ComponentProps & {
  currency: Currency;
  isSelected: boolean;
  onPress?: (currency: Currency) => void;
};
const CurrencySelectionItem = ({
  currency,
  isSelected,
  onPress,
  style,
}: CurrencySelectionItemProps) => (
  <TouchableOpacity
    style={style}
    onPress={onPress ? () => onPress(currency) : undefined}
  >
    <PeachText
      numberOfLines={1}
      style={[
        tw`text-center button-large text-black-65`,
        isSelected && tw`text-black-100`,
      ]}
    >
      {currency}
    </PeachText>
    {isSelected && (
      <View style={[tw`w-full h-0.5 -mt-0.5 bg-black-100 rounded-1px`]} />
    )}
  </TouchableOpacity>
);

const ItemSeparator = ({ style }: ComponentProps) => (
  <View style={[tw`w-px h-4 bg-black-5 rounded-1px`, style]} />
);

type Props = ComponentProps & {
  currencies: Currency[];
  selected: Currency;
  select?: (currency: Currency) => void;
};

export const CurrencySelection = ({
  currencies,
  selected,
  select,
  style,
}: Props) => (
  <View style={[tw`flex-row flex-wrap justify-center`, style]}>
    {currencies.map((currency, index) => (
      <View
        style={tw`flex-row items-center grow min-w-1/8 max-w-1/4`}
        key={`currency-selection-${currency}`}
      >
        <CurrencySelectionItem
          currency={currency}
          isSelected={currency === selected}
          onPress={select}
          style={tw`grow`}
        />
        {index < currencies.length - 1 && (
          <ItemSeparator
            key={`currency-selection-separator${currency}`}
            style={tw`mx-1`}
          />
        )}
      </View>
    ))}
  </View>
);
