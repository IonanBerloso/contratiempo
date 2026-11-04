import { DANCERS } from "../data/dancers.js";
export const findDancerById = (dancerId) =>
  DANCERS.find((dancer) => dancer.id === dancerId);
