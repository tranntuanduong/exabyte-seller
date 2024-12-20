import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { IMAGE_BASE_URL } from "src/constants/aws";
import useFetchNotifyCation from "src/hooks/api/notify/useFetchNotifyCation";

interface PopupAddNotify {
  open: boolean;
  handleClose: () => void;
}

const Notifycation = ({ open, handleClose }: PopupAddNotify) => {
  const [{ data }, handleGetNotify] = useFetchNotifyCation();
  console.log('data', data)
  useEffect(() => {
    handleGetNotify();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Thông báo mới</DialogTitle>
      {data &&
        data.map((item, idx) => (
          <DialogContent key={idx}>
            <Box
              sx={{ display: "flex", alignItems: "center", columnGap: "20px" }}
            >
              {/*  cần fix content - imgs  : tạo thông báo (admin)  -> thông báo */}
              <img
                style={{ width: "100px", borderRadius: '10px' }}
                // src={`${IMAGE_BASE_URL}/${item.image}`}
                src="/images/avatars/1.png"
              />
              <Box>
                <DialogTitle sx={{ paddingBottom: "10px", paddingLeft: 0 }}>{item.title}</DialogTitle>
                {item?.content && (
                  <Box dangerouslySetInnerHTML={{ __html: item?.content }} />
                )}
              </Box>
            </Box>
          </DialogContent>
        ))}
    </Dialog>
  );
};
export default Notifycation;
