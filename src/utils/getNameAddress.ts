import { listDiaChinh } from "src/constants/diachinh";

export const getNameAddress = (id: string) => {
  return listDiaChinh.find((item: any) => item.id === id)?.ten;
};
