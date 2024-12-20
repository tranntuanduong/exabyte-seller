import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, InputAdornment } from "@mui/material";
import { AnyAaaaRecord } from "dns";
import { Control, useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import * as yup from "yup";
interface Props {
  control: Control<any, any>;
}

const SingleSalesInfomation = ({ control }: Props) => {
  return (
    <Grid item xs={6}>
      <form>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <div>
              <ControlTextField
                control={control}
                name="price"
                // onChange={handleChangeProductPrice}
                fullWidth
                label="Giá"
                placeholder=""
                type="number"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    alignItems: "baseline",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">| đ</InputAdornment>
                  ),
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <ControlTextField
              control={control}
              name="stock"
              fullWidth
              label="Kho hàng"
              placeholder=""
              type="number"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  alignItems: "baseline",
                },
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default SingleSalesInfomation;
