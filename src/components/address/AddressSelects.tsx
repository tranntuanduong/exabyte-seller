import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import { useEffect, useMemo } from "react";
import { IListSelectAddressProps } from "src/hooks/api/useFetchShopAddress";

interface AddressSelectProps {
  /**
   * listAddress là dữ liệu truyền vào ví dụ như listProvince,district,...
   */
  listAddress: IListSelectAddressProps[] | any[];
  /**
   * label là tên hiển thị của input
   */
  label: string;
  /**
   * handleInfluence : là hàm xử lý các các address có phụ thuộc như dùng handlePickProvince để có thể lấy ra được
   * idProvince và truy xuất đến các quận huyển phụ thuộc tỉnh đó
   */
  handleInfluence?: (value: string) => void;
  /**
   * watch là value của Autocomplete
   */
  watch?: any;
  className?: string;
  /**
   * setValue và nameValue 1 cặp có liên quan với nhau setValue là hàm của react-hook-form dùng để setValue cho
   * 1 value trong state của hook
   */
  setValue?: any;
  nameValue?: string;
  /**
   * setValueSelect là 1 setState bình thường
   */
  setValueSelect?: any;
}
const AddressSelects = ({
  className,
  watch,
  handleInfluence,
  label,
  listAddress,
  setValue,
  nameValue,
  setValueSelect,
}: AddressSelectProps) => {
  // useEffect(() => {
  //   console.log("watch", { watch });
  //   console.log("listAddress", { listAddress });

  //   if (listAddress.length === 0 && !watch) {
  //     if (setValue && nameValue) setValue(nameValue, null);
  //   }
  //   if (!handleInfluence) return;
  //   const addressSelect = listAddress.filter((item) => item.id === watch);

  //   const iAddress = addressSelect.map((item) => item.id).join();
  //   handleInfluence(iAddress);
  //   // eslint-disable-next-line
  // }, [watch, listAddress, handleInfluence]);

  const listAddressCustom = useMemo(() => {
    return listAddress.map((item) => ({
      ...item,
      label: item.ten,
    }));
  }, [listAddress]);

  const handleOnChange = (event: React.SyntheticEvent, value: any | null) => {
    if (setValue && nameValue) {
      setValue(nameValue, value?.id);
    }
    setValueSelect && setValueSelect(value?.id);
  };
  return (
    <FormControl
      size="small"
      className={` ${className ? className : "col-span-4"}`}
      fullWidth
    >
      <Box
        sx={{
          margin: "5px 0",
        }}
      >
        {label}
      </Box>
      <Autocomplete
        noOptionsText="Không có gì"
        disablePortal
        value={watch}
        size="small"
        id="combo-box-demo"
        fullWidth
        ListboxProps={{ style: { maxHeight: "10rem" } }}
        options={listAddressCustom}
        renderInput={(params) => <TextField {...params} placeholder={label} />}
        onChange={handleOnChange}
        defaultValue=""
      />
    </FormControl>
  );
};

export default AddressSelects;
