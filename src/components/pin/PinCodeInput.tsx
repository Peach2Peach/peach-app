import { Text, TouchableOpacity, View } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import tw from "../../styles/tailwind";
const rows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "delete"],
];

export function DeleteButton({
  onPress,
  isOverlay = false,
}: {
  onPress: () => void;
  isOverlay?: boolean;
}) {
  const color = isOverlay ? tw.color("text-primary-mild-1") : "#F56522";
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 113,
        height: 89,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 90.217,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
        <G clipPath="url(#clip0_4087_41579)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.3276 4.76153C10.5982 4.45229 10.9891 4.2749 11.4 4.2749H29.925C31.0588 4.2749 32.1462 4.7253 32.9479 5.52702C33.7496 6.32874 34.2 7.4161 34.2 8.5499V25.6499C34.2 26.7837 33.7496 27.8711 32.9479 28.6728C32.1462 29.4745 31.0588 29.9249 29.925 29.9249H11.4C10.9891 29.9249 10.5982 29.7475 10.3276 29.4383L0.352578 18.0383C-0.117526 17.501 -0.117526 16.6988 0.352578 16.1615L10.3276 4.76153ZM12.0466 7.1249L3.3185 17.0999L12.0466 27.0749H29.925C30.3029 27.0749 30.6654 26.9248 30.9326 26.6575C31.1999 26.3903 31.35 26.0278 31.35 25.6499V8.5499C31.35 8.17197 31.1999 7.80951 30.9326 7.54227C30.6654 7.27504 30.3029 7.1249 29.925 7.1249H12.0466ZM16.0924 11.8173C16.6489 11.2608 17.5511 11.2608 18.1076 11.8173L21.375 15.0846L24.6424 11.8173C25.1989 11.2608 26.1011 11.2608 26.6576 11.8173C27.2141 12.3738 27.2141 13.276 26.6576 13.8325L23.3903 17.0999L26.6576 20.3673C27.2141 20.9238 27.2141 21.826 26.6576 22.3825C26.1011 22.939 25.1989 22.939 24.6424 22.3825L21.375 19.1152L18.1076 22.3825C17.5511 22.939 16.6489 22.939 16.0924 22.3825C15.5359 21.826 15.5359 20.9238 16.0924 20.3673L19.3597 17.0999L16.0924 13.8325C15.5359 13.276 15.5359 12.3738 16.0924 11.8173Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_4087_41579">
            <Rect width="34.2" height="34.2" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </TouchableOpacity>
  );
}

function Digit({
  value,
  onPress,
  isOverlay = false,
}: {
  value: string;
  onPress: (s: string) => void;
  isOverlay?: boolean;
}) {
  const color = isOverlay ? tw.color("text-primary-mild-1") : "#F56522";

  return (
    <TouchableOpacity
      disabled={!value}
      onPress={() => value && onPress(value)}
      style={[
        {
          width: 113,
          height: 89,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 90.217,
          overflow: "visible",
        },
        tw`items-center justify-center`,
      ]}
    >
      <Text
        style={{
          color: color,
          fontFamily: "Baloo2-Medium",
          fontSize: 52,
        }}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

export function PinCodeInput({
  onDigitPress,
  onDelete,
  isOverlay = false,
  currentPin,
}: {
  onDigitPress: (s: string) => void;
  onDelete: () => void;
  isOverlay?: boolean;
  currentPin: string;
}) {
  return (
    <View
      style={[
        tw`self-stretch flex-row flex-wrap items-center`,
        {
          justifyContent: "center",
          alignContent: "center",
          gap: 2,
        },
      ]}
    >
      {rows.flat().map((digit, index) => {
        // Last row: after "0", render DeleteButton
        const isLastRow = index >= 9;
        if (isLastRow && digit === "delete" && currentPin.length > 0) {
          return (
            <View key={index} style={{ margin: 1 }}>
              <DeleteButton onPress={onDelete} isOverlay={isOverlay} />
            </View>
          );
        }

        return (
          <View key={index} style={{ margin: 1 }}>
            <Digit
              value={digit === "delete" ? "" : digit}
              onPress={onDigitPress}
              isOverlay={isOverlay}
            />
          </View>
        );
      })}
    </View>
  );
}
