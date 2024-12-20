import { LoadingButton } from "@mui/lab";
import { Box, Card, Typography } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ControlTextField from "src/components/form/ControlTextField";
import useFetchUserByRefCode from "src/hooks/api/shop/useFetchUserByRefCode";
import useUpdateReferalUser from "src/hooks/api/shop/useUpdateReferalUser";
import { useAuth } from "src/hooks/useAuth";

const AffiliatePage = () => {
  const { fetchShopProfile, user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    mode: "onSubmit",
  });

  const { data, handleUpdate, loading } = useUpdateReferalUser({
    onSuccess: () => {
      fetchShopProfile();
    },
  });

  const { fetchUserByRefCode, data: refererUser } = useFetchUserByRefCode();

  const onSubmit = (data: any) => {
    if (!data.referrerCode) {
      toast.error("Vui lòng nhập mã người giới thiệu");
      return;
    }

    handleUpdate(data);
  };

  useEffect(() => {
    if (!user.referrerCode) return;

    fetchUserByRefCode(user.referrerCode?.split(",")?.[0]);
  }, [user]);

  console.log("refererUser", refererUser);

  return (
    <Card>
      <Box
        sx={{
          p: "20px",
        }}
      >
        {!user?.referrerCode && (
          <Fragment>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
              }}
            >
              Nhập mã người giới thiệu
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ControlTextField
                control={control}
                name="referrerCode"
                label="Mã người giới thiệu"
                ditaction="column"
                type={"text"}
                sx={{
                  background: "#F5F5F5",
                  border: "none",
                }}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                }}
                loading={loading}
                disabled={loading}
              >
                Xác nhận
              </LoadingButton>
            </form>
          </Fragment>
        )}

        {user?.referrerCode && (
          <Fragment>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
              }}
            >
              Người giới thiệu
            </Typography>
            <Box>{refererUser?.email}</Box>
            <Box>{refererUser?.username}</Box>
          </Fragment>
        )}
      </Box>
    </Card>
  );
};

export default AffiliatePage;
