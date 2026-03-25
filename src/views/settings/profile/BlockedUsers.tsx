import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/Header";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { statusCardStyles } from "../../../components/statusCard/statusCardStyles";
import { PeachText } from "../../../components/text/PeachText";
import { useBlockedUsers } from "../../../hooks/query/peach069/useBlockedUsers";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export const BlockedUsers = () => {
  const { blockedUsers, isLoading, refetch } = useBlockedUsers();

  useFocusEffect(
    useCallback(() => {
      refetch();

      return () => {};
    }, []),
  );

  if (isLoading) return <></>;

  return (
    <Screen header={<Header title={i18n("profile.user.blockedUsers")} />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-between grow gap-7`}
      >
        <View style={tw`grow`} onStartShouldSetResponder={() => true}>
          {blockedUsers && blockedUsers.length > 0 ? (
            <FlatList
              contentContainerStyle={[
                tw`bg-transparent py-7`,
                isLoading && tw`opacity-60`,
              ]}
              onRefresh={refetch}
              refreshing={false}
              showsVerticalScrollIndicator={false}
              data={blockedUsers}
              renderItem={({ item }) => <BlockedUserItem item={item} />}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          ) : (
            <BlockedUsersPlaceholder />
          )}
        </View>
      </PeachScrollView>
    </Screen>
  );
};

const BlockedUserItem = ({ item }: { item: User }) => {
  const navigation = useStackNavigation();
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-light-color`,
        tw.style(statusCardStyles.border["primary"]),
      ]}
      onPress={() => {
        navigation.navigate("publicProfile", {
          userId: item.id,
        });
      }}
    >
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <PeachText style={tw`text-center mt-1`}>
          <PeachText
            style={tw.style(
              isDarkMode ? "text-primary-mild-2" : "text-black-100",
            )}
          >
            {"Peach ID: " + item.id.slice(0, 8)}
          </PeachText>
        </PeachText>
      </View>
    </TouchableOpacity>
  );
};

const BlockedUsersPlaceholder = () => (
  <View style={tw`items-center justify-center flex-1`}>
    <PeachText style={tw`h6 text-black-50 text-center`}>
      {i18n("profile.blockedUsers.empty")}
    </PeachText>
  </View>
);
