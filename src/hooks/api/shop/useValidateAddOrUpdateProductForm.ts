import { useEffect, useState } from "react";
import { stringArrToSlug } from "src/utils/string";
import * as yup from "yup";

interface Props {
  watch: any;
  validate: any;
  setValidate: any;
  validationSchema: any;
  unregister: any;
  variantType: any;
}

const useValidateAddOrUpdateProductForm = ({
  watch,
  setValidate,
  validate,
  validationSchema,
  unregister,
  variantType,
}: Props) => {
  const watchClassify = watch("classify");
  const watchClassify2 = watch("classify2");

  useEffect(() => {
    watchClassify
      ?.filter((item: any) => item.name)
      .forEach((_: any, index: any) => {
        if (watchClassify2?.length > 1) {
          watchClassify2
            ?.filter((item2: any) => item2.name)
            .forEach((__: any, index2: any) => {
              unregister(`${stringArrToSlug(["price", index, index2])}`);
              unregister(`${stringArrToSlug(["inventory", index, index2])}`);
              unregister(`${stringArrToSlug(["weight", index, index2])}`);
            });
        } else {
          unregister(`${stringArrToSlug(["price", index])}`);
          unregister(`${stringArrToSlug(["inventory", index])}`);
          unregister(`${stringArrToSlug(["weight", index])}`);
        }
      });

    unregister("classify");
    unregister("classify2");
    unregister("classifyDesc");
    unregister("classifyDesc2");
    unregister("price");
    unregister("stock");
  }, [variantType]);

  useEffect(() => {
    const classifyValidate: Record<string, any> = {};
    watchClassify
      ?.filter((item: any) => item.name)
      .forEach((_: any, index: any) => {
        if (watchClassify2?.length > 1) {
          watchClassify2
            ?.filter((item2: any) => item2.name)
            .forEach((__: any, index2: any) => {
              classifyValidate[`${stringArrToSlug(["price", index, index2])}`] =
                yup.string().required("Bắt buộc");
              classifyValidate[
                `${stringArrToSlug(["inventory", index, index2])}`
              ] = yup.string().required("Bắt buộc");
              // classifyValidate[
              //   `${stringArrToSlug(["weight", index, index2])}`
              // ] = yup.string().required("Bắt buộc");
            });
        } else {
          console.log("classifyValidatexxxxx123", index);
          classifyValidate[`${stringArrToSlug(["price", index])}`] = yup
            .string()
            .required("Bắt buộc");
          classifyValidate[`${stringArrToSlug(["inventory", index])}`] = yup
            .string()
            .required("Bắt buộc");
          // classifyValidate[`${stringArrToSlug(["weight", index])}`] = yup
          //   .string()
          //   .required("Bắt buộc");
        }
      });

    setValidate(
      validationSchema.shape(classifyValidate).shape({
        ...(watchClassify?.length === 1 && {
          classifyDesc: yup.string().required("Bắt buộc"),
        }),
        ...(watchClassify2?.length > 1 && {
          classifyDesc2: yup.string().required("Bắt buộc"),
        }),
        ...(variantType === "single" && {
          price: yup
            .string()
            .matches(
              /^(1000|[1-9]\d{3,7}|100000000)$/,
              "Vui lòng nhập giá hợp lệ "
            )
            .required("Vui lòng nhập kho hàng sản phẩm"),

          stock: yup
            .string()
            .required("Vui lòng nhập kho hàng sản phẩm")
            .matches(
              /^(?!0)(?:[1-9]\d{0,6}|10000000)$/,
              "Vui lòng nhập giá trị hợp lệ "
            ),
        }),
      })
    );
  }, [watchClassify, watchClassify2]);
};

export default useValidateAddOrUpdateProductForm;
