import { API_URL } from "@env";
import { peachAPI as peachAPIFactory } from "../../../peach-api";
import { UNIQUEID } from "../../constants";

export const peachAPI = peachAPIFactory({
  url: API_URL,
  peachAccount: null,
  uniqueId: UNIQUEID,
});
