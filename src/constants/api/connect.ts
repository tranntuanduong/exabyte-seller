export const apiKiot = "https://public.kiotapi.com";
interface ConfigBearer {
  headers: {
    accessToken: string;
    retailer: string;
  };
}

export const getConfigBearer = (): ConfigBearer => {
  const bearerToken = localStorage.getItem("accessTokenKiotViet") ?? "";
  const retailer = localStorage.getItem("addressKiotViet") ?? "";
  return {
    headers: {
      accessToken: bearerToken,
      retailer: retailer,
    },
  };
};
