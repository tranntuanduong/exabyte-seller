import { CardContent, Divider } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import UserIcon from "src/layouts/components/UserIcon";
import React, { useEffect, useState } from "react";
import useDeleteShopAddress from "src/hooks/api/useDeleteShopAddress";
import useFetchShopAddress from "src/hooks/api/useFetchShopAddress";
import { Address } from "src/types/address";
import AddAddressDialog from "src/views/pages/address/AddAddressDialog";
import EditAddressDialog from "src/views/pages/address/EditAddressDialog";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";

const AddressPage = () => {
  const [{ data, loading }, fetchShopAddress] = useFetchShopAddress();
  console.log(data, "testdata");
  const { data: deleteRes, deleteShopAddress } = useDeleteShopAddress(() => {
    fetchShopAddress();
  });
  const [addressSelected, setAddressSelected] = useState<Address>();
  console.log("123", addressSelected);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  //combobox tinh-quan-huyen

  const { getOptionById } = usePickAddress();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAddressSelected(undefined);
  };
  const handleClickUpdateShopAddress = (address: Address) => {
    console.log("bbb", address);

    setOpenUpdate(true);
    setAddressSelected(address);
  };
  const handleCloseUpdateShopAddress = () => {
    setOpenUpdate(false);
  };

  const handleDeleteShopAddress = (id: any) => {
    deleteShopAddress(id);
  };

  //xu ly sdt + 84
  const convertPhoneNumber = (phone: string) => {
    const newPhone = phone.substring(1);
    return `(+84) ${newPhone}`;
  };
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: "1000",
              color: "black",
            }}
          >
            Địa chỉ kho
          </Typography>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            sx={{
              color: "white",
              fontWeight: "800",
              position: "relative",
            }}
          >
            Thêm địa chỉ mới
          </Button>
        </Box>
        <Divider sx={{ pt: 4 }}></Divider>
        {data.map((address, index: number) => {
          return (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", pt: 4 }}
            >
              <Box
                sx={{
                  display: "flex",
                  columnGap: "50px",
                }}
              >
                <Box sx={{ opacity: "0.7" }}>
                  <Typography>Họ và tên</Typography>
                  <Typography>Số điện thoại</Typography>
                  <Typography>Địa chỉ</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: "800" }}>
                    {address.name}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    {convertPhoneNumber(address.phone)}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    {address.desc}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {getOptionById(address.ward).ten}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    {getOptionById(address.district).ten}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    {getOptionById(address.province).ten}
                  </Typography>
                </Box>
                {address.status === "ACTIVE" && (
                  <Typography
                    sx={{
                      backgroundColor: "#86e9d2",
                      borderRadius: "3px",
                      color: "#fff",
                      width: "fit-content",
                      height: "fit-content",
                      padding: "2px 6px",
                    }}
                  >
                    {address.status === "ACTIVE" && "Địa chỉ mặc định"}
                  </Typography>
                )}
              </Box>
              <Box>
                <Box
                  onClick={() => handleClickUpdateShopAddress(address)}
                  sx={{
                    display: "flex",
                    columnGap: "5px",
                    cursor: "pointer",
                  }}
                >
                  <UserIcon icon="eva:edit-2-fill" />
                  <Typography
                    sx={{
                      fontWeight: "600",
                    }}
                  >
                    Sửa
                  </Typography>
                </Box>
                {address.status === "INACTIVE" && (
                  <Box
                    onClick={() => handleDeleteShopAddress(address.id)}
                    sx={{
                      display: "flex",
                      columnGap: "5px",
                      mt: 2,
                      cursor: "pointer",
                    }}
                  >
                    <UserIcon icon="mdi:delete" />
                    <Typography
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      Xóa
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </CardContent>

      <AddAddressDialog
        open={open}
        onClose={handleClose}
        onSuccess={fetchShopAddress}
        // addressSelected={addressSelected}
      />
      <EditAddressDialog
        idUpdate={String(addressSelected?.id)}
        addressSelected={addressSelected}
        openUpdate={openUpdate}
        onCloseUpdate={handleCloseUpdateShopAddress}
        fetchShopAddress={fetchShopAddress}
      />
    </Card>
  );
};

export default AddressPage;
