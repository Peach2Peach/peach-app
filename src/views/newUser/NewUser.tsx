import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { Loading } from "../../components/animation/Loading";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useUserUpdate } from "../../init/useUserUpdate";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { createAccount } from "../../utils/account/createAccount";
import { deleteAccount } from "../../utils/account/deleteAccount";
import { storeAccount } from "../../utils/account/storeAccount";
import { updateAccount } from "../../utils/account/updateAccount";
import { parseError } from "../../utils/parseError";
import { LOGIN_DELAY } from "../restoreReputation/LOGIN_DELAY";
import { useRegisterUser } from "./useRegisterUser";

export const NewUser = () => {
  const route = useRoute<"newUser">();
  const navigation = useStackNavigation();

  const [success, setSuccess] = useState(false);
  const setAccount = useAccountStore((state) => state.setAccount);
  const [userExistsForDevice, setUserExistsForDevice] = useState(false);
  const [error, setError] = useState("");

  const onError = useCallback((err?: string) => {
    const errorMsg = err || "UNKNOWN_ERROR";
    setError(errorMsg);
    deleteAccount();
  }, []);

  const { mutate: registerUser } = useRegisterUser();

  const userUpdate = useUserUpdate();
  const { t } = useTranslate("welcome");

  const onSuccess = useCallback(
    (account: Account & { mnemonic: string; base58: string }) => {
      registerUser(account, {
        onError: (err) => onError(err.message),
        onSuccess: async ({ restored }) => {
          if (restored) {
            setAccount(account);
            setUserExistsForDevice(true);
            return;
          }
          await updateAccount(account, true);
          await userUpdate(route.params.referralCode);

          storeAccount(account);
          setSuccess(true);

          setTimeout(() => {
            navigation.navigate("userSource");
          }, LOGIN_DELAY);
        },
      });
    },
    [
      navigation,
      onError,
      registerUser,
      route.params.referralCode,
      setAccount,
      userUpdate,
    ],
  );

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        onSuccess(await createAccount());
      } catch (e) {
        onError(parseError(e));
      }
    });
  }, [onError, onSuccess]);

  return (
    <Screen
      header={
        <Header
          title={t("welcome.welcomeToPeach.title")}
          theme="transparent"
          hideGoBackButton
        />
      }
      gradientBackground
    >
      {success ? (
        <CreateAccountSuccess />
      ) : userExistsForDevice ? (
        <UserExistsForDevice />
      ) : error ? (
        <CreateAccountError err={error} />
      ) : (
        <CreateAccountLoading />
      )}
    </Screen>
  );
};

function CreateAccountLoading() {
  const { t } = useTranslate("unassigned");
  return (
    <View style={tw`items-center justify-center gap-4 grow`}>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {t("newUser.title.create")}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {t("newUser.oneSec")}
      </PeachText>
      <Loading style={tw`w-32 h-32`} color={tw.color("primary-mild-1")} />
    </View>
  );
}

type CreateAccountErrorProps = {
  err: string;
};
function CreateAccountError({ err }: CreateAccountErrorProps) {
  const navigation = useStackNavigation();
  const goToContact = () => navigation.navigate("contact");
  const goToRestoreBackup = () => navigation.navigate("restoreBackup");
  const { t } = useTranslate("unassigned");

  return (
    <View style={tw`items-center justify-between grow`}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <View>
          <PeachText style={tw`text-center h4 text-primary-background-light`}>
            {t("newUser.title.create")}
          </PeachText>
          <PeachText
            style={tw`text-center body-l text-primary-background-light`}
          >
            {/** @ts-ignore */}
            {t(`${err}.text`, { ns: "error" })}
          </PeachText>
        </View>
        <Icon
          id="userX"
          size={128}
          color={tw.color("primary-background-light")}
        />
      </View>

      <View style={tw`gap-2`}>
        <Button
          onPress={goToContact}
          style={tw`bg-primary-background-light`}
          textColor={tw.color("primary-main")}
        >
          {t("contactUs")}
        </Button>
        <Button onPress={goToRestoreBackup} ghost>
          {t("restore")}
        </Button>
      </View>
    </View>
  );
}

function CreateAccountSuccess() {
  const { t } = useTranslate("unassigned");

  return (
    <View style={tw`items-center justify-center gap-16 grow`}>
      <View>
        <PeachText style={tw`text-center h4 text-primary-background-light`}>
          {t("newUser.title.accountCreated")}
        </PeachText>
        <PeachText style={tw`text-center body-l text-primary-background-light`}>
          {t("newUser.welcome")}
        </PeachText>
      </View>
      <Icon
        id="userCheck"
        size={128}
        color={tw.color("primary-background-light")}
      />
    </View>
  );
}

function UserExistsForDevice() {
  const route = useRoute<"newUser">();
  const navigation = useStackNavigation();
  const goToRestoreFromFile = () =>
    navigation.navigate("restoreBackup", { tab: "fileBackup" });
  const goToRestoreFromSeed = () =>
    navigation.navigate("restoreBackup", { tab: "seedPhrase" });
  const goToRestoreReputation = () =>
    navigation.navigate("restoreReputation", route.params);
  const { t } = useTranslate("unassigned");

  return (
    <View style={tw`items-center justify-center gap-8 grow`}>
      <View>
        <PeachText style={tw`text-center h4 text-primary-background-light`}>
          {t("newUser.accountNotCreated")}
        </PeachText>
        <PeachText style={tw`text-center body-l text-primary-background-light`}>
          {t("newUser.youAlreadyHaveOne")}
        </PeachText>
      </View>
      <Icon
        id="userX"
        size={128}
        color={tw.color("primary-background-light")}
      />
      <View style={tw`items-center gap-8`}>
        <MenuItem onPress={goToRestoreFromFile}>
          {t("restoreBackup.restoreFromFile")}
        </MenuItem>
        <MenuItem onPress={goToRestoreFromSeed}>
          {t("restoreBackup.restoreFromSeed")}
        </MenuItem>
        <MenuItem onPress={goToRestoreReputation}>
          {t("restoreBackup.IdontHave")}
        </MenuItem>
      </View>
    </View>
  );
}

type MenuItemProps = ComponentProps & {
  onPress: () => void;
};
function MenuItem({ children, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`flex-row items-center justify-between w-60`}
    >
      <PeachText style={tw`settings text-primary-background-light`}>
        {children}
      </PeachText>
      <Icon
        id="chevronRight"
        style={tw`w-6 h-6`}
        color={tw.color("primary-background-light")}
      />
    </TouchableOpacity>
  );
}
