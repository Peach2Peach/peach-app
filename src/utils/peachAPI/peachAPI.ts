import { API_URL } from "@env";
import { PeachAPI as peachAPIFactory } from "../../../peach-api";
import { UNIQUEID } from "../../constants";

export const peachAPI = new peachAPIFactory({
  url: API_URL,
  peachAccount: null,
  uniqueId: UNIQUEID,
});
