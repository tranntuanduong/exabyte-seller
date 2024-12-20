import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { Fragment, ReactNode, createContext, useEffect, useState } from "react";
import { IS_AFFILIATE } from "src/constants/env";
import useFetchWarehouses from "src/hooks/api/warehouse/useFetchWarehouses";
import { useAuth } from "src/hooks/useAuth";
import UserIcon from "src/layouts/components/UserIcon";
import BankInfomationTab from "src/views/pages/profile/BankInfomationTab";
import AddWarehouseContent from "src/views/pages/warehouse/AddWarehouseContent";

interface SetupShopContextParams {}

const SetupShopContext = createContext<SetupShopContextParams | null>(null);

interface Props {
  children: ReactNode;
}

enum SetupStep {
  Bank = 0,
  Warehouse = 1,
  Congratulation = 2,
}

const SetupShopProvider = ({ children }: Props) => {
  const [step, setStep] = useState<SetupStep>(SetupStep.Bank);

  const { user, fetchShopProfile, logout, loading: userLoading } = useAuth();
  const {
    data: warehouseData,
    loading: warehouseLoading,
    fetchWarehouse,
  } = useFetchWarehouses();
  const [error, setError] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    fetchWarehouse();
  }, [user?.id]);

  // check if user already setup warehouse and shop bank info
  useEffect(() => {
    if (!user?.id) return;

    if (warehouseData?.length === 0 || !user?.shopBankAccount) {
      setOpen(true);
    }

    if (user?.shopBankAccount && warehouseData?.length === 0) {
      setStep(SetupStep.Warehouse);
      setOpen(true);
      return;
    }

    if (
      user?.shopBankAccount &&
      warehouseData &&
      warehouseData.length > 0 &&
      step !== SetupStep.Congratulation
    ) {
      setOpen(false);
      return;
    }
  }, [user?.id, warehouseData?.length]);

  return (
    <SetupShopContext.Provider value={null}>
      {children}

      {!IS_AFFILIATE && (
        <Dialog
          open={open}
          keepMounted
          fullWidth
          maxWidth="md"
          // onClose={}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>Bắt đầu setup gian hàng với 2 bước đơn giản.</Box>
              <Box
                sx={{
                  p: 2,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (step === SetupStep.Congratulation) {
                    setOpen(false);
                  } else {
                    logout();
                  }
                }}
              >
                <UserIcon icon="mdi:window-close" />
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Stepper activeStep={step}>
                <Step>
                  <StepLabel>Tài khoản ngân hàng</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Thông tin kho hàng</StepLabel>
                </Step>
              </Stepper>
              <Fragment>
                {step === SetupStep.Bank && (
                  <Box
                    sx={{
                      mt: 5,
                    }}
                  >
                    {error && (
                      <Box
                        sx={{
                          color: "#c72b22",
                          display: "flex",
                          gap: "10px",
                          mb: 4,
                          bgcolor: "#fdecea",
                          p: 3,
                          alignItems: "center",
                          fontSize: "12px",
                        }}
                      >
                        <UserIcon icon="mdi:alert-circle-outline" />
                        <Box>{error}</Box>
                      </Box>
                    )}
                    <BankInfomationTab
                      buttonName="Tiếp tục"
                      onSuccess={() => setStep(SetupStep.Warehouse)}
                      onError={(message) => {
                        setError(message ?? "");
                        fetchShopProfile();
                      }}
                    />
                  </Box>
                )}
                {step === SetupStep.Warehouse && (
                  <Box
                    sx={{
                      mt: 5,
                    }}
                  >
                    <Box
                      sx={{
                        color: "#1b9efb",
                        display: "flex",
                        gap: "10px",
                        mb: 4,
                        bgcolor: "#f1f5f8",
                        p: 3,
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <UserIcon icon="mdi:alert-circle-outline" />
                      <Box>
                        Kho hàng: là kho mà đơn vị vận chuyển sẽ đến lấy hàng
                        hoặc hoàn hàng.
                      </Box>
                    </Box>
                    <AddWarehouseContent
                      warehouseSelected={null}
                      buttonName="Kết thúc"
                      onSuccess={async () => {
                        await fetchWarehouse();
                        setStep(SetupStep.Congratulation);
                        // toast.success("Setup gian hàng thành công", {
                        //   duration: 3000,
                        // });
                      }}
                      hasToast={false}
                    />
                  </Box>
                )}
                {step === SetupStep.Congratulation && (
                  <Box
                    sx={{
                      mt: 5,
                    }}
                  >
                    <Box>
                      Xin chúc mừng, gian hàng của bạn đã được setup thành công,
                      hãy bắt đầu đăng sản phẩm đầu tiên, sau đó thêm vào kho để
                      bắt đầu kinh doanh.
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        width: "fit-content",
                        marginLeft: "auto",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => setOpen(false)}
                      >
                        Đã hiểu
                      </Button>
                    </Box>
                  </Box>
                )}
              </Fragment>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      )}
    </SetupShopContext.Provider>
  );
};

export default SetupShopProvider;

export const useSetupShopContext = () => {
  const context = SetupShopContext;
  if (context === undefined) {
    throw new Error(
      "useSetupShopContext must be used within a SetupShopProvider"
    );
  }
  return context;
};
