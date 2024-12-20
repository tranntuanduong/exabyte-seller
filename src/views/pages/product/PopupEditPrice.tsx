import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment } from "@mui/material"
import { use, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import { Product, UpdateProductPriceStock } from "src/types/product";
import { stringArrToSlug } from "src/utils/string";
import * as yup from "yup";
const schemaValidate = yup.object().shape({
  // stock: yup.string().min(1, "gia tri khong nho hon 1").max(10000000, "gia tri khong lon hon 10000000").required("bat buoc")
})
interface PopupEditPriceProps {
  handleClose: () => void;
  open: boolean;
  productSelected: Product
  data: UpdateProductPriceStock
  handleUpdatePriceStock: any

}

const PopupEditPrice = ({
  handleUpdatePriceStock,
  handleClose,
  open,
  productSelected,
}: PopupEditPriceProps) => {
  // validate truong hop co nhieu options 
  const schemaValidate = useMemo(() => {
    let validates: any;
    if (productSelected?.options.length === 0) {
      validates = {
        price: yup.string().matches(/^(1000|[1-9]\d{3,7}|100000000)$/, "giá trị không hợp lệ"),
      }
    } else {
      validates = productSelected?.options?.reduce((acc: any, _option) => {
        const name = stringArrToSlug(_option.name.split(","));
        acc[name] = yup.string().matches(/^(1000|[1-9]\d{3,7}|100000000)$/, "giá trị không hợp lệ")
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

  console.log('productSelected', productSelected)
  const defaultValues = useMemo(() => {
    if ((productSelected?.options?.length !== 0)) {
      return productSelected?.options?.reduce((acc: any, cur) => {
        acc[stringArrToSlug(cur.name.split(","))] = cur.price
        return acc
      }, {})
    } else {
      return { 'price': productSelected?.price }
    }
  }, [productSelected])
  console.log('defaultValues', defaultValues)
  useEffect(() => {
    // if (productSelected?.options?.length === 0) {
    //   return
    // }
    // const defaultValues = productSelected?.options?.reduce((acc: Record<string, number>, cur) => {
    //   acc[stringArrToSlug(cur.name.split(","))] = +cur.price
    //   return acc
    // }, {})
    reset(defaultValues)
  }, [open])
  console.log({
    productSelected
  })
  console.log(1232, watch('price'))
  const onSubmit = async () => {
    let dataUpdate
    if (productSelected?.options?.length === 0) {
      dataUpdate = {
        options: [
          {
            price: watch('price'),
          },
        ],
        productId: +(productSelected?.id)
      }
    } else {
      const dataOption = productSelected?.options?.reduce((acc: any, cur) => {
        const obj: any = {}
        obj['optionId'] = cur.id
        obj['price'] = watch(stringArrToSlug(cur.name.split(",")))

        acc.push(obj)
        return acc
      }, [])
      dataUpdate = {
        options: dataOption, productId: +(productSelected?.id)
      }
    }


    console.log('dataUpdate', dataUpdate)
    await handleUpdatePriceStock(
      dataUpdate,
    )
    handleClose()
  }
  const handleGetPrice = () => {
    const price = getValues("basePrice")
    const initData = productSelected?.options?.reduce((acc: Record<string, number>, _option) => {
      acc[stringArrToSlug(_option.name.split(","))] = price
      return acc
    }, {})
    reset(initData)
  }

  const handleChangeProductPrince = (event: any) => {
    console.log(event.target.value, 'hjkfsdjkfsdjk')
    let inputValue = event.target.value.replace(/\D/g, "");
    if (inputValue.length > 9) {
      inputValue = inputValue.slice(0, 9);
    }
    setValue("price", inputValue);
    setValue("basePrice", inputValue)
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
          Cập nhật giá
        </DialogTitle>
        <DialogContent>
          {productSelected?.options?.length === 0 ? (
            <Box>
              <ControlTextField
                control={control}
                placeholder={stringArrToSlug(productSelected.name.split(","))}
                name="price"
                label={productSelected.name}
                ditaction="column"
                // onChange={handleChangeProductPrince}
                InputProps={{
                  startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                }}
                type="text"
              />

            </Box>
          ) : (
            <Box>
              <ControlTextField
                control={control}
                placeholder=""
                name="basePrice"
                label="Chỉnh sửa hàng loạt"
                ditaction="column"
                onChange={handleChangeProductPrince}

                InputProps={{
                  startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                }}
                type="text"

              />
              <DialogActions sx={{ paddingRight: '0' }}>
                <Button variant="contained" onClick={handleGetPrice}>
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
                  InputProps={{
                    startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                  }}
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
          <Button variant="contained" type="submit" >
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default PopupEditPrice