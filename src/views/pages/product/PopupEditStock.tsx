import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { __ssrPromises } from "axios-hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import { Product } from "src/types/product";
import { stringArrToSlug } from "src/utils/string";
import * as yup from "yup";
const schemaValidate = yup.object().shape({
  // stock: yup.string().min(1, "gia tri khong nho hon 1").max(10000000, "gia tri khong lon hon 10000000").required("bat buoc")
})

interface PopupEditProductProps {
  handleClose: () => void;
  open: boolean;
  productSelected: Product
  handleUpdatePriceStock: any

}

const PopupEditStock = ({
  handleUpdatePriceStock,
  handleClose,
  open,
  productSelected,
}: PopupEditProductProps) => {
  const schemaValidate = useMemo(() => {
    let validates: any;
    if (productSelected?.options.length === 0) {
      validates = {
        stock: yup.string().matches(/^(?!0)(?:[1-9]\d{0,6}|10000000)$/, "giá trị không hợp lệ"),
      }
    } else {
      validates = productSelected?.options?.reduce((acc: any, _option) => {
        const name = stringArrToSlug(_option.name.split(","));
        acc[name] = yup.string().matches(/^(?!0)(?:[1-9]\d{0,6}|10000000)$/, "giá trị không hợp lệ")
        return acc;
      }, {})
    }

    return (yup.object().shape(validates))

  }, [productSelected])
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<any>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onChange",
    resolver: yupResolver(schemaValidate),
  });

  const defaultValues = useMemo(() => {
    if ((productSelected?.options.length !== 0)) {
      return productSelected?.options?.reduce((acc: any, cur) => {
        acc[stringArrToSlug(cur.name.split(","))] = cur.stock
        return acc
      }, {})
    } else {
      return { 'stock': productSelected?.stock }
    }
  }, [productSelected])
  useEffect(() => {
    //case have no options

    // const defaultValues = productSelected?.options?.reduce((acc: Record<string, number>, cur) => {
    //   acc[stringArrToSlug(cur.name.split(","))] = cur.stock
    //   return acc
    // }, {})


    console.log("defaultValues", defaultValues)
    reset(defaultValues)
  }, [open])

  const [errorxxx, setError] = useState("")
  // console.log("productSelectedproductSelected", productSelected)
  const onSubmit = async () => {
    let dataUpdate
    if (productSelected?.options?.length === 0) {
      dataUpdate = {
        options: [
          { stock: watch('stock') }
        ],
        productId: +(productSelected?.id)
      }
    }
    else {
      const dataOption = productSelected?.options?.reduce((acc: any, cur) => {
        const obj: any = {}
        obj['optionId'] = cur.id
        obj['stock'] = watch(stringArrToSlug(cur.name.split(",")))

        acc.push(obj)
        return acc
      }, [])
      dataUpdate = {
        options: dataOption, productId: +(productSelected?.id)
      }
    }

    await handleUpdatePriceStock(
      dataUpdate
    )
    handleClose()
  }
  const hanldeGetStock = () => {
    const stock = getValues("baseStock")
    const initData = productSelected?.options?.reduce((acc: Record<string, number>, _option) => {
      acc[stringArrToSlug(_option.name.split(","))] = stock
      return acc;

    }, {})

    console.log("initData", initData)

    reset(initData)
  }

  const handleChangeProductStock = (event: any) => {
    let inputValue = event.target.value.replace(/\D/g, "");
    if (inputValue.length > 8) {
      inputValue = inputValue.slice(0, 8);
    }
    setValue("stock", inputValue);
    setValue("baseStock", inputValue)
  };
  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="alert-dialog-title">
          Cập nhật kho hàng
        </DialogTitle>


        <DialogContent>
          {productSelected?.options?.length === 0 ? (
            <Box>
              <ControlTextField
                control={control}
                placeholder={stringArrToSlug(productSelected.name.split(","))}
                name="stock"
                label={productSelected.name}
                ditaction="column"
                type="text"
              // onChange={handleChangeProductStock}
              />
              {/* <div>{errorxxx}</div> */}
            </Box>
          ) : (
            <Box>
              <ControlTextField
                control={control}
                placeholder=""
                name="baseStock"
                label="Chỉnh sửa linh hoạt"
                ditaction="column"
                type="text"
                onChange={handleChangeProductStock}
              />
              <DialogActions sx={{ paddingRight: '0' }}>
                <Button variant="contained" onClick={hanldeGetStock} >
                  Áp dụng cho tất cả phân loại
                </Button>
              </DialogActions>
              {productSelected?.options?.map((_option) => (
                <ControlTextField
                  key={_option.id}
                  control={control}
                  placeholder={stringArrToSlug(_option.name.split(","))}
                  name={stringArrToSlug(_option.name.split(","))}
                  label={_option.name}
                  ditaction="column"
                  type="text"
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" type="submit">
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>

  );
};
export default PopupEditStock;
