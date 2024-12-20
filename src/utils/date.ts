export const daysInThisMonth = (date: any) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  console.log('month', month)
  const lastDayThisMonth = new Date(year, month, 0).getDate();

  return lastDayThisMonth;

};

export const getFirstAndLastDayOfMonth = (date: Date) => {
  const firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).toISOString();
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toISOString();

  return { firstDay, lastDay };
};
