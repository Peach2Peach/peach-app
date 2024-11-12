import { useRef } from "react";
import { TouchableOpacity } from "react-native";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import { Icon } from "./Icon";
import { InfoContainer } from "./InfoContainer";
import { CopyAble, CopyAbleRef } from "./ui/CopyAble";

type Props = { id: string; copyable?: boolean };

const PEACH_ID_LENGTH = 8;
export function PeachID({ id, copyable = false }: Props) {
  const peachId = `Peach${id.slice(0, PEACH_ID_LENGTH)}`.toUpperCase();
  const navigation = useStackNavigation();

  const goToUserProfile = () =>
    navigation.navigate("publicProfile", { userId: id });

  const copyRef = useRef<CopyAbleRef>(null);

  const icon = copyable ? (
    <CopyAble
      value={peachId}
      ref={copyRef}
      style={tw`w-3 h-3`}
      textPosition="right"
    />
  ) : (
    <Icon id="info" size={12} color={tw.color("primary-main")} />
  );

  const copy = () => copyRef.current?.copy();
  const onContainerPress = copyable ? copy : goToUserProfile;

  return (
    <TouchableOpacity onPress={onContainerPress}>
      <InfoContainer
        text={peachId}
        backgroundColor={tw.color("primary-background-dark-color")}
        textColor={tw.color("black-100")}
        icon={icon}
      />
    </TouchableOpacity>
  );
}
