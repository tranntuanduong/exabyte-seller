export const mapError: Record<string, string> = {
  "name must be longer than or equal to 5 characters":
    "Tên phải dài hơn 5 kí tự",
};

export const getErrorMessage = (error: any) => {
  return error?.response?.data?.message?? "Có lỗi xảy ra";
};
