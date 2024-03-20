import { Linking, View } from "react-native";
import tw from "../../styles/tailwind";

import { useMutation } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useState } from "react";
import { getInstallReferrer } from "react-native-device-info";
import { Loading } from "../../components/Loading";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { PeachText } from "../../components/text/PeachText";
import { useSetToast } from "../../components/toast/Toast";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { useUserUpdate } from "../../init/useUserUpdate";
import { tolgee } from "../../tolgee";
import { useAccountStore } from "../../utils/account/account";
import { createAccount } from "../../utils/account/createAccount";
import { deleteAccount } from "../../utils/account/deleteAccount";
import { storeAccount } from "../../utils/account/storeAccount";
import { updateAccount } from "../../utils/account/updateAccount";
import { parseError } from "../../utils/parseError";
import { peachAPI } from "../../utils/peachAPI";
import { createRandomWallet } from "../../utils/wallet/createRandomWallet";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { useRegisterUser } from "../newUser/useRegisterUser";
import { LOGIN_DELAY } from "../restoreReputation/LOGIN_DELAY";

const referralCodeRules = { referralCode: true };
export const LetsGetStarted = () => {
  const navigation = useStackNavigation();
  const showError = useShowErrorBanner();
  const setToast = useSetToast();
  const [referralCode, setReferralCode, referralCodeIsValid] =
    useValidatedState<string>("", referralCodeRules);
  const [willUseReferralCode, setWillUseReferralCode] = useState(false);

  const handleRefCode = useCallback(
    ({ url }: { url: string | null }) => {
      if (!url) return;
      const link = new URL(url).searchParams.get("link");
      if (!link) return;
      const code = new URL(link).searchParams.get("code");
      if (!code) return;
      setReferralCode(code);
      setWillUseReferralCode(true);
    },
    [setReferralCode],
  );

  useEffect(() => {
    const listener = Linking.addEventListener("url", handleRefCode);
    return () => listener.remove();
  }, [handleRefCode, setReferralCode]);

  useEffect(() => {
    Linking.getInitialURL().then((url) => handleRefCode({ url }));
  }, [handleRefCode]);

  useEffect(() => {
    getInstallReferrer().then((ref) => {
      if (!ref || ref === "unknown") return;
      setReferralCode((prev) => prev || ref);
      setWillUseReferralCode(true);
    });
  }, [setReferralCode]);

  const updateReferralCode = (code: string) => {
    if (referralCode !== code) setWillUseReferralCode(false);
    setReferralCode(code);
  };

  const { mutate: checkReferralCodeMutation } = useCheckReferralCode();

  const checkReferralCode = () => {
    setWillUseReferralCode(false);
    checkReferralCodeMutation(referralCode, {
      onError: (error) => showError(error.message),
      onSuccess: ({ valid }) => {
        setWillUseReferralCode(valid);
        setToast({
          msgKey: valid ? "referrals.myFavoriteCode" : "referrals.codeNotFound",
          color: "white",
        });
      },
    });
  };

  const { t } = useTranslate();
  const { mutate: registerUser } = useRegisterUser();
  const userUpdate = useUserUpdate();
  const [isLoading, setIsLoading] = useState(false);
  const onError = useCallback(
    (err?: string) => {
      const errorMsg = err || "UNKNOWN_ERROR";
      deleteAccount();
      navigation.navigate("createAccountError", {
        err: errorMsg,
      });
      setIsLoading(false);
    },
    [navigation],
  );
  const setAccount = useAccountStore((state) => state.setAccount);
  const createNewUser = async () => {
    setIsLoading(true);
    const referralCodeParam = willUseReferralCode ? referralCode : undefined;
    try {
      const { wallet, mnemonic } = await createRandomWallet(getNetwork());
      const newAccount = await createAccount({ wallet, mnemonic });
      registerUser(newAccount, {
        onError: (err) => onError(err.message),
        onSuccess: async ({ restored }) => {
          if (restored) {
            setAccount(newAccount);
            navigation.navigate("userExistsForDevice", {
              referralCode: referralCodeParam,
            });
            setIsLoading(false);
            return;
          }
          await updateAccount(newAccount, true);
          await userUpdate(willUseReferralCode ? referralCode : undefined);

          storeAccount(newAccount);
          navigation.navigate("accountCreated");
          setIsLoading(false);

          setTimeout(() => {
            navigation.navigate("userSource");
          }, LOGIN_DELAY);
        },
      });
    } catch (e) {
      onError(parseError(e));
    }
  };

  const goToRestoreBackup = () => navigation.navigate("restoreBackup");
  if (isLoading) return <CreateAccountLoading />;
  return (
    <View style={tw`items-center flex-1 gap-4 shrink`}>
      <View style={tw`justify-center gap-4 grow`}>
        <PeachText
          style={[tw`text-center h5 text-primary-background-light`, tw`md:h4`]}
        >
          {t("welcome.letsGetStarted.title", { ns: "welcome" })}
        </PeachText>

        <View>
          <PeachText style={tw`text-center text-primary-background-light`}>
            {t("newUser.referralCode")}
          </PeachText>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <View style={tw`h-14`}>
              <Input
                style={tw`w-40 mt-2`}
                theme="inverted"
                maxLength={16}
                placeholder={tolgee
                  .t("form.optional", { ns: "form" })
                  .toUpperCase()}
                onChangeText={updateReferralCode}
                onSubmitEditing={(e) => updateReferralCode(e.nativeEvent.text)}
                value={referralCode}
                autoCapitalize="characters"
              />
            </View>
            <Button
              style={tw`min-w-20 bg-primary-background-light`}
              textColor={tw.color("primary-main")}
              disabled={
                willUseReferralCode || !referralCode || !referralCodeIsValid
              }
              onPress={checkReferralCode}
            >
              {t(willUseReferralCode ? "referrals.used" : "referrals.use", {
                ns: "referral",
              })}
            </Button>
          </View>
        </View>
      </View>

      <View style={tw`gap-2`}>
        <Button
          onPress={createNewUser}
          style={tw`bg-primary-background-light`}
          loading={isLoading}
          textColor={tw.color("primary-main")}
          iconId="plusCircle"
        >
          {t("newUser")}
        </Button>
        <Button onPress={goToRestoreBackup} iconId="save" ghost>
          {t("restore")}
        </Button>
      </View>
    </View>
  );
};

function useCheckReferralCode() {
  return useMutation({
    mutationFn: async (code: string) => {
      const { result, error } = await peachAPI.public.user.checkReferralCode({
        code,
      });
      if (!result || error)
        throw new Error(error?.error || "Could not check referral code");
      return result;
    },
  });
}

function CreateAccountLoading() {
  const { t } = useTranslate();
  return (
    <View style={tw`items-center justify-center gap-4 grow`}>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {t("newUser.title.create")}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {t("newUser.oneSec")}
      </PeachText>
      <Loading size={"large"} color={tw.color("primary-mild-1")} />
    </View>
  );
}
