import { useEffect } from "react";
import { Control, useFieldArray, UseFormWatch } from "react-hook-form";

interface Props {
  control?: Control<any>;
  watch: UseFormWatch<any>;
  name: string;
}

const useCustomFieldArray = ({ watch, control, name }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });
  const watchFieldArray = watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  const isAppend = controlledFields.every((item) => item.name);

  useEffect(() => {
    if (isAppend && controlledFields.length < 20) {
      append({});
    }
  }, [isAppend]);

  return {
    controlledFields,
    remove,
  };
};

export default useCustomFieldArray;
