import axios from "axios";
import { apiKiot, getConfigBearer } from "src/constants/api/connect";

export const getProductKiot = async () => {
  return await axios.get(`${apiKiot}/products`, getConfigBearer());
};
