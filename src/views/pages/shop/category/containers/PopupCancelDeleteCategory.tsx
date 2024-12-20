import { Button, Dialog } from "@mui/material";
import React from "react";

const PopupCancelDeleteCategory = ({
  setOpenDialogDeleteCategory,
  openDialogDeleteCategory,
  handleDeleteCategory,
  deleteSelected,
}: any) => {
  function checkEnter(event: any) {
    if (event.keyCode === 13 || event.which === 13) {
      console.log(event, "event");
      // Lấy giá trị của input và hiển thị nó lên trang web
      // var value = event.target.value;
      // document.getElementById("result").innerHTML =
      //   "Số key của phím Enter là: " + value;
    }
  }
  return (
    <div>
      <Dialog
        onClose={() => setOpenDialogDeleteCategory(false)}
        open={openDialogDeleteCategory}
      >
        <div style={{ padding: "32px" }}>
          <div
            style={{
              fontSize: "20px",
            }}
          >
            Xác Nhận Huỷ Đơn Hàng
          </div>
          <div
            style={{
              paddingTop: "40px",
              paddingLeft: "80px",
            }}
            className="pt-10 pl-20 space-x-3"
          >
            <Button
              onClick={() => setOpenDialogDeleteCategory(false)}
              style={{
                marginRight: "12px",
                border: "1px solid #C72B23",
              }}
              className="border-[1px] border-[#C72B23] text-[#C72B23] hover:bg-white"
            >
              Huỷ
            </Button>
            <Button
              // loading={loadingUpdateOrderStatus}
              // onKeyDown={(event) => {
              //   console.log(event, "jhdsfjkhdsjkf");
              //   if (event.key === "Enter") {
              //     handleDeleteCategory(deleteSelected.id);
              //   }
              // }}
              onClick={() => handleDeleteCategory(deleteSelected.id)}
              style={{
                backgroundColor: "#C72B23 ",
                color: "white",
              }}
              className="bg-[#C72B23] hover:bg-primary hover:opacity-[0.9]"
            >
              Xác Nhận
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PopupCancelDeleteCategory;
