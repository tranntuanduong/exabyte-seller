import { useMemo } from "react";
import { useAuth } from "./useAuth";

interface CascaderItem {
  label: string;
  value: string;
  children?: CascaderItem[];
  type?: string;
}

interface Option {
  childrens: Option[];
  [key: string]: any;
}

interface Props {
  data: Option[];
  mapValue?: string;
  mapLabel?: string;
}

const useFormatCascaderValue = ({
  data,
  mapValue = "id",
  mapLabel = "name",
}: Props): CascaderItem[] => {
  const { user } = useAuth();

  const convertArrayToValue = (array: Option[]): CascaderItem[] => {
    const type = user.role === "supplier" ? "NCC" : "SHOP";

    return array
      .filter((item) => item.type === type)
      .map((item) => {
        const { childrens } = item;
        const value: CascaderItem = {
          label: item[mapLabel],
          value: item[mapValue],
          type: item.type,
        };

        if (childrens && childrens.length > 0) {
          value.children = convertArrayToValue(childrens);
        }

        return value;
      });
  };

  return convertArrayToValue(data);
};

export default useFormatCascaderValue;
