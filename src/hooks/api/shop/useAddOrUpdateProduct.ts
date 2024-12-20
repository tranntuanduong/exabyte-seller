import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { ADD_PRODUCT, UPDATE_PRODUCT } from "src/constants/api/product";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import useUploadImage from "../upload/useUploadImage";
import { stringArrToSlug } from "src/utils/string";
import { PreviewImgs } from "src/components/form/MutipleUploadImage";
import { PromotionType } from "src/constants";

interface Props {
  categoryIds: number[];
  categoryId: number | null;
  editorRef: any;
  optionImages: Record<string, File>;
  productImages: File[];
  product?: any;
  oldProductImages?: PreviewImgs[];
  productVideo?: File[];
  isUpdateVideo?: boolean;
  isSeperateSize?: boolean;
  originPrice?: PromotionType;
}

const useAddOrUpdateProduct = ({
  categoryIds,
  categoryId,
  editorRef,
  optionImages,
  productImages,
  product,
  oldProductImages = [],
  productVideo = [],
  isUpdateVideo,
  isSeperateSize = false,
  originPrice = PromotionType.INACTIVE,
}: Props) => {
  const router = useRouter();

  const { handleUploadImage, loading: uploadImgLoading } = useUploadImage({
    multiple: true,
  });
  //call video
  const { handleUploadImage: handleUploadVideo, loading: uploadVideoLoading } =
    useUploadImage({
      multiple: false,
    });

  const [{ data, loading, error }, _handleAddProduct] = useHttpClient<any>(
    {
      ...ADD_PRODUCT,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const [{ loading: updateLoading, error: updateError }, _handleUpdateProduct] =
    useHttpClient<any>(
      {
        ...UPDATE_PRODUCT,
      },
      {
        manual: true,
        dataPath: "data",
      }
    );

  const handleAddProduct = async (newProduct: any) => {
    try {
      await _handleAddProduct({
        data: newProduct,
      });
      toast.success("Thêm sản phẩm thành công");
      router.replace("/shop/product");
    } catch (error: any) {
      console.log("error123", error);
      toast.error("Thêm sản phẩm thất bại");
    }
  };

  const handleUpdateProduct = async (newProduct: any) => {
    try {
      await _handleUpdateProduct({
        data: newProduct,
        param: product.id,
      });
      toast.success("Cập nhật sản phẩm thành công");
      router.replace("/shop/product");
    } catch (error: any) {
      console.log("error123", error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  const classifyWithValue = (classify: any[], classifyName: string) => {
    const details = classify
      ?.filter((_item) => _item.name)
      ?.map((_item) => {
        return {
          ..._item,
          value: stringArrToSlug([_item.name]),
        };
      });

    return {
      classifyName,
      details,
    };
  };

  const handleConvertDataAndPushProduct = async (data: any) => {
    console.log("data", data);
    if (!categoryId) {
      toast.error("Vui lòng chọn ngành hàng");
      return;
    }
    const description = editorRef.current?.getContent() ?? "";

    let productVideoUrl = null;
    if (productVideo.length > 0) {
      const formData = new FormData();
      formData.append("image", productVideo[0]);
      const res = await handleUploadVideo(formData);
      productVideoUrl = res?.data?.data?.key ?? "";
    }

    //upload option images
    const _optionImages: Record<string, string> = {};
    if (Object.values(optionImages).length > 0) {
      const formData = new FormData();
      Object.values(optionImages).forEach((file) => {
        formData.append("images", file);
      });

      const res = await handleUploadImage(formData);

      if (!res) {
        toast.error("Some thing went wrong!");
        return;
      }

      if (res?.data?.data?.length > 0) {
        Object.keys(optionImages).forEach((key, index) => {
          _optionImages[key] = res?.data?.data[index]?.key;
        });
      }
    }
    const _productImgs: string[] = [];
    console.log("productImages", productImages);

    if (productImages.length > 0) {
      const formData = new FormData();
      productImages.forEach((file, index) => {
        formData.append("images", file, `file-${index}`);
      });

      const res = await handleUploadImage(formData);

      if (!res) {
        toast.error("Some thing went wrong!");
        return;
      }

      if (res?.data?.data?.length > 0) {
        res?.data?.data?.forEach((item: any) => {
          _productImgs.push(item.key);
        });
      }
    }

    try {
      const slugs: any = [];
      data?.classify?.forEach((_item: any, _index: any) => {
        if (isEmpty(data?.classify2?.[0])) {
          slugs.push(stringArrToSlug([_index]));
        } else {
          data?.classify2?.forEach((_item2: any, _index2: any) => {
            slugs.push(stringArrToSlug([_index, _index2]));
          });
        }
      });

      const classifyDetails = slugs?.reduce(
        (acc: Record<string, any>, cur: string) => {
          if (data[`inventory-${cur}`]) {
            acc[`inventory-${cur}`] = data[`inventory-${cur}`];
          }

          if (data[`price-${cur}`]) {
            acc[`price-${cur}`] = data[`price-${cur}`];
          }
          if (data[`weight-${cur}`]) {
            acc[`weight-${cur}`] = data[`weight-${cur}`];
          }
          return acc;
        },
        {}
      );

      const classifyInventoryDetails = Object.keys(classifyDetails)?.reduce(
        (_acc: Record<string, string>, _key) => {
          if (!_key.includes("inventory-")) return _acc;
          _acc[_key] = classifyDetails[_key];
          return _acc;
        },
        {}
      );

      const totalStock = Object.keys(classifyInventoryDetails)?.reduce(
        (_acc: number, _key: string) => {
          _acc = parseInt(classifyDetails[_key]) + _acc;
          return _acc;
        },
        0
      );

      const options = Object.keys(classifyInventoryDetails)?.map((_key) => {
        const tierIndex = _key.split("inventory-")?.[1]?.split("-");

        const name =
          data.classify[tierIndex[0]].name +
          (data?.classify2?.[tierIndex[1]]?.name
            ? `, ${data?.classify2?.[tierIndex[1]]?.name}`
            : "");
        const option = {
          sku: "",
          tierIndex: tierIndex,
          name: name,
          price: classifyDetails[`price-${tierIndex.join("-")}`],
          stock: classifyDetails[`inventory-${tierIndex.join("-")}`],
          weight: classifyDetails[`weight-${tierIndex.join("-")}`],
          image:
            _optionImages[stringArrToSlug([data.classify[tierIndex[0]].name])],
        };

        return option;
      });

      console.log("options", options);

      const classify1 = classifyWithValue(data.classify, data.classifyDesc);
      const classify2 = classifyWithValue(data.classify2, data.classifyDesc2);

      const tierVariantion = [
        {
          name: classify1?.classifyName,
          options: classify1?.details?.map((_item: any) => _item.name),
        },
        {
          name: classify2?.classifyName,
          options: classify2?.details?.map((_item: any) => _item.name),
        },
      ].filter((_item) => _item.name);

      // const priceArr = Object.keys(classifyDetails).reduce(
      //   (_acc: number[], _key) => {
      //     if (!_key.includes("price-")) return _acc;
      //     _acc.push(parseInt(classifyDetails[_key]));
      //     return _acc;
      //   },
      //   []
      // );

      // const maxPrice = maxBy(priceArr);
      // const minPrice = minBy(priceArr);

      if (product) {
        //update img
        const updateProductImgs: any = [
          ...oldProductImages,
          ..._productImgs.map((_img: string) => ({
            id: null,
            url: _img,
          })),
        ];

        const updateOptionsTierIndex = options?.map((_option) =>
          _option.tierIndex.toString()
        );

        //update option variant
        const oldOptions =
          product?.options
            ?.filter((_option: any) =>
              updateOptionsTierIndex.includes(_option.tierIndex)
            )
            ?.map((_option: any, index: any) => {
              const findOption = options.find(
                (_updateOption) =>
                  _updateOption.tierIndex.toString() === _option.tierIndex
              );

              return {
                ..._option,
                name: findOption?.name,
                price: findOption?.price,
                stock: findOption?.stock,
                weight: isSeperateSize ? findOption?.weight : null,
              };
            }) ?? [];

        const oldOptionsTierIndex = oldOptions.map(
          (_option: any) => _option.tierIndex
        );

        const newOptions =
          options
            ?.filter(
              (_option) =>
                !oldOptionsTierIndex.includes(_option.tierIndex.toString())
            )
            ?.map((_option) => {
              return {
                ..._option,
                tierIndex: _option.tierIndex.toString(),
              };
            }) ?? [];

        //upadte tiervariant
        const oldTierVariantion = product?.tierVariants?.map(
          (_variant: any, index: number) => ({
            ..._variant,
            name: tierVariantion[index].name,
            options: tierVariantion[index].options,
          })
        );

        const updateProduct: any = {
          images: updateProductImgs,
          video: isUpdateVideo ? productVideoUrl : product?.video,
          name: data.productName,
          description: description,
          price: data.price ?? 0,
          stock:
            data?.classify1 && data?.classify2 ? totalStock : data?.stock ?? 0,
          options: [...oldOptions, ...newOptions],
          tierVariantion: [...oldTierVariantion],
          shippingInfo: {
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight,
          },
          status: "ACTIVE",
          categories: categoryIds,
          originPrice,
          promotionalPercent:
            originPrice === "ACTIVE" ? data.promotionalPercent : 0,
        };

        handleUpdateProduct(updateProduct);
      } else {
        const newProduct: any = {
          images: _productImgs,
          video: productVideoUrl,
          name: data.productName,
          description: description,
          price: data.price ?? 0,
          stock:
            data?.classify1 && data?.classify2 ? totalStock : data?.stock ?? 0,
          options: options,
          tierVariantion: tierVariantion,
          shippingInfo: {
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight,
          },
          status: "ACTIVE",
          categories: categoryIds,
          originPrice,
          promotionalPercent:
            originPrice === "ACTIVE" ? data.promotionalPercent : 0,
        };
        console.log("newProduct::::::", newProduct);

        handleAddProduct(newProduct);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return {
    data,
    loading: loading || uploadImgLoading || updateLoading || uploadVideoLoading,
    error,
    handleConvertDataAndPushProduct,
  };
};

export default useAddOrUpdateProduct;
