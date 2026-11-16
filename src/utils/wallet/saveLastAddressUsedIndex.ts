import { User69 } from "../../../peach-api/src/@types/user69";
import { user69DetailsKeys } from "../../hooks/query/peach069/useUser69";
import { queryClient } from "../../queryClient";
import { error } from "../log/error";
import { parseError } from "../parseError";
import { peachAPI } from "../peachAPI";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @description records that the release address at `index` was handed out, so
 * the next trade picks a fresh one.
 *
 * The cached user is updated right away, so this session never reuses the
 * address even while the server is unreachable. The server save is retried a
 * few times and never throws: the payment confirmation it follows has already
 * gone through and must not be reported as failed because of it.
 *
 * @returns whether the server stored the index
 */
export const saveLastAddressUsedIndex = async (index: number) => {
  queryClient.setQueryData<User69 | undefined>(
    user69DetailsKeys.details(),
    (user) =>
      user && {
        ...user,
        lastAddressUsedIndex: Math.max(user.lastAddressUsedIndex ?? -1, index),
      },
  );

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // eslint-disable-next-line no-await-in-loop -- deliberately sequential retries
    if (await trySave(index, attempt)) {
      queryClient.invalidateQueries({ queryKey: user69DetailsKeys.all });
      return true;
    }
    // eslint-disable-next-line no-await-in-loop -- backoff between retries
    if (attempt < MAX_ATTEMPTS) await wait(RETRY_DELAY_MS * attempt);
  }
  return false;
};

async function trySave(index: number, attempt: number) {
  try {
    const { error: err } =
      await peachAPI.private.peach069.setLastAddressUsedIndexOnSelfUser69({
        index,
      });
    if (!err) return true;
    error("saveLastAddressUsedIndex - attempt", attempt, err.error);
  } catch (e) {
    error("saveLastAddressUsedIndex - attempt", attempt, parseError(e));
  }
  return false;
}
