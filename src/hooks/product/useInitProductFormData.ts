import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";
import { stringArrToSlug } from "src/utils/string";

interface Props {
  data?: any;
  reset: UseFormReset<any>;
  setCategoryId: any;
  setCategoryIds: any;
  setVariantType: any;
  setOptionImages: any;
  setValue: any;
}

const useInitProductFormData = ({
  data,
  reset,
  setCategoryId,
  setCategoryIds,
  setVariantType,
  setValue,
  setOptionImages,
}: Props) => {
  // init infomation basic
  useEffect(() => {
    if (!data) return;

    reset({
      productName: data.name,
      description: data.description,
      width: data.width,
      height: data.height,
      length: data.length,
      weight: data.weight,
      promotionalPercent: data.promotionalPercent
    });

    //category
    const categories = data.categories;
    setCategoryId(categories?.[categories.length - 1]?.id);
    setCategoryIds(categories.map((category: any) => category.id));

    //check variant type
    if (data.options.length > 0) {
      setVariantType("mutiple");
    }
    const initOptionImage: Record<string, any> = {};

    // init tier variant
    if (data.tierVariants.length === 2) {
      data.tierVariants.forEach((_variant: any, index: number) => {
        const _index = index === 0 ? "" : index + 1;
        setValue(`classifyDesc${_index}`, _variant.name);
        _variant.options.split(",").forEach((_option: any, index2: number) => {
          setValue(`classify${_index}.${index2}.name`, _option);
        });
      });
    } else if (data.tierVariants.length === 1) {
      const _variant = data.tierVariants[0];
      setValue(`classifyDesc`, _variant?.name);

      _variant?.options?.split(",").forEach((_option: any, _index: number) => {
        setValue(`classify.${_index}.name`, _option);
      });
    }

    //init options details
    if (data.tierVariants.length === 2) {
      data.tierVariants[0].options
        .split(",")
        .forEach((_option: any, index: number) => {
          data.tierVariants[1].options
            .split(",")
            .forEach((_option: any, index2: number) => {
              const findOption = data.options.find(
                (_option: any) => _option.tierIndex === `${index},${index2}`
              );

              setValue(
                stringArrToSlug(["price", index, index2]),
                findOption?.price
              );
              setValue(
                stringArrToSlug(["inventory", index, index2]),
                findOption?.stock
              );

              setValue(
                stringArrToSlug(["weight", index, index2]),
                findOption?.weight
              );

              if (index2 === 0) {
                initOptionImage[
                  stringArrToSlug([findOption?.name?.split(",")?.[0]])
                ] = findOption?.image;
              }
            });
        });
    } else if (data.tierVariants.length === 1) {
      data.tierVariants[0].options
        .split(",")
        .forEach((_option: any, _index: number) => {
          const findOption = data.options.find(
            (_option: any) => _option.tierIndex === `${_index}`
          );
          setValue(stringArrToSlug(["price", _index]), findOption?.price);
          setValue(stringArrToSlug(["inventory", _index]), findOption?.stock);
          setValue(stringArrToSlug(["weight", _index]), findOption?.weight);

          initOptionImage[
            stringArrToSlug([findOption?.name?.split(",")?.[0]])
          ] = findOption?.image;
        });
    } else {
      setValue(`price`, data?.price);
      setValue(`stock`, data?.stock);
    }

    //init option image
    setOptionImages(initOptionImage);
  }, [data]);
};

export default useInitProductFormData;
