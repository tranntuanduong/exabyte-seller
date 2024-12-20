export type DateType =
  | "today"
  | "yesterday"
  | "7days"
  | "30days"
  | "day"
  | "week"
  | "month"
  | "year";

export interface DataFetchStatistic {
  order_cancel: { order_cancel: string; date: number }[];
  order_completed: { date: number; sales: string; order_completed: string }[];
}
