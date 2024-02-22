import { useCallback } from "react";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import { AppPopup } from "../../../popups/AppPopup";
import tw from "../../../styles/tailwind";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { WarningPopup } from "../../../popups/WarningPopup";
import { error } from "../../../utils/log/error";
import { peachAPI } from "../../../utils/peachAPI";
import { matchesKeys } from "../../../views/search/hooks/useOfferMatches";
import { Button } from "../../buttons/Button";
import { useClosePopup, useSetPopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { ClosePopupAction } from "../../popup/actions/ClosePopupAction";
import { useSetToast } from "../../toast/Toast";
import { UndoButton } from "./UndoButton";
import { useTranslate } from "@tolgee/react";

type Props = {
  match: Pick<Match, "matched" | "offerId">;
  offer: BuyOffer;
  interruptMatching: () => void;
  setShowMatchedCard: (show: boolean) => void;
};

export const UnmatchButton = ({
  match,
  offer,
  interruptMatching,
  setShowMatchedCard,
}: Props) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId);
  const { t } = useTranslate();

  const [showUnmatch, toggle] = useToggleBoolean(match.matched);

  const showUnmatchPopup = useCallback(() => {
    setPopup(
      <WarningPopup
        title={t("search.popups.unmatch.title")}
        content={t("search.popups.unmatch.text")}
        actions={
          <>
            <PopupAction
              label={t("search.popups.unmatch.confirm")}
              iconId="minusCircle"
              textStyle={tw`text-black-100`}
              onPress={() => {
                setPopup(
                  <WarningPopup
                    title={t("search.popups.unmatched")}
                    actions={
                      <ClosePopupAction
                        style={tw`justify-center`}
                        textStyle={tw`text-black-100`}
                      />
                    }
                  />,
                );
                unmatch(undefined, {
                  onSuccess: () => {
                    setShowMatchedCard(false);
                  },
                });
              }}
            />
            <PopupAction
              label={t("search.popups.unmatch.neverMind")}
              textStyle={tw`text-black-100`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    );
  }, [closePopup, setPopup, setShowMatchedCard, unmatch, t]);

  const onUndoPress = () => {
    interruptMatching();
    setPopup(<AppPopup id="matchUndone" />);
  };

  return showUnmatch ? (
    <Button
      onPress={showUnmatchPopup}
      iconId="minusCircle"
      textColor={tw.color("error-main")}
      style={tw`bg-primary-background-light`}
    >
      {t("search.unmatch")}
    </Button>
  ) : (
    <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
  );
};

function useUnmatchOffer(offer: BuyOffer, matchingOfferId: string) {
  const queryClient = useQueryClient();
  const setToast = useSetToast();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: matchesKeys.matchesForOffer(offer.id),
      });
      await queryClient.cancelQueries({
        queryKey: matchesKeys.matchDetail(offer.id, matchingOfferId),
      });
      const previousData = queryClient.getQueryData<Match>([
        "matchDetails",
        offer.id,
        matchingOfferId,
      ]);
      queryClient.setQueryData<Match>(
        matchesKeys.matchDetail(offer.id, matchingOfferId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            matched: false,
          };
        },
      );
      return { previousData };
    },
    mutationFn: async () => {
      const { result, error: err } = await peachAPI.private.offer.unmatchOffer({
        offerId: offer.id,
        matchingOfferId,
      });
      if (result) {
        return result;
      }
      error("Error", err);
      setToast({ msgKey: err?.error || "error.general", color: "red" });
      throw new Error();
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        matchesKeys.matchDetail(offer.id, matchingOfferId),
        context?.previousData,
      );
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offer.id) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchesForOffer(offer.id),
        }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchDetail(offer.id, matchingOfferId),
        }),
      ]),
  });
}
