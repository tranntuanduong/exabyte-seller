export const getResponseMessage = (error: any) => {
  return error.response?.data?.message ?? error.message;
};
