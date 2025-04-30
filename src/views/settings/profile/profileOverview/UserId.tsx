import { Bubble } from "../../../../components/bubble/Bubble";
import { useStackNavigation } from "../../../../hooks/useStackNavigation";

type Props = { id: string; showInfo?: boolean };

const MAX_LENGTH = 8;

/**
 * @deprecated use PeachID instead
 */
export const UserId = ({ id }: Props) => {
  const peachId = `Peach${id.slice(0, MAX_LENGTH)}`;
  const navigation = useStackNavigation();
  const goToUserProfile = () =>
    navigation.navigateDeprecated("publicProfile", { userId: id });

  return (
    <Bubble
      color="primary"
      iconSize={12}
      iconId={"info"}
      onPress={goToUserProfile}
    >
      {peachId}
    </Bubble>
  );
};
