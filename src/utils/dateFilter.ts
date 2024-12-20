import dayjs from "dayjs";

export const useDate = () => {
  const currentDate = dayjs();
  const timeNow = currentDate.format("HH:mm");
  const yesterday = dayjs().subtract(1, "day").format("DD-MM-YYYY");
  const currentDateYesterday = dayjs().subtract(1, "day");
  const sevenDaysAgo = currentDate.subtract(7, "day");
  const formattedRangeSeven = `${sevenDaysAgo.format(
    "DD-MM-YYYY"
  )} - ${currentDateYesterday.format("DD-MM-YYYY")}`;
  const thirtyDaysAgo = currentDate.subtract(30, "day");
  const formattedRangeThirty = `${thirtyDaysAgo.format(
    "DD-MM-YYYY"
  )} - ${currentDateYesterday.format("DD-MM-YYYY")}`;

  return {
    timeNow,
    yesterday,
    formattedRangeSeven,
    formattedRangeThirty,
  };
};
