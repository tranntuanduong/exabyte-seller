import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import * as yup from "yup";

import { Grid } from "@mui/material";
import ControlAutocompleteSelect from "src/components/form/ControlAutocompleteSelect";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import useAddWarehouse, {
  AddWarehouseParams,
} from "src/hooks/api/warehouse/useAddWarehouse";
import { useEffect } from "react";
import { Warehouse } from "src/types/warehouse";
import useUpdateWarehouseAddress from "src/hooks/api/warehouse/useUpdateWarehouseAddress";
import AddWarehouseContent from "./AddWarehouseContent";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  warehouseSelected: Warehouse | null;
}

const AddWarehouseDialog = ({
  onClose,
  open,
  onSuccess,
  warehouseSelected,
}: Props) => {
  console.log("trigger");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogContent
        sx={{
          columnGap: "10px",
          alignItems: "center",
        }}
      >
        {warehouseSelected ? (
          <h4>Chỉnh sửa thông tin hàng</h4>
        ) : (
          <h4>Thêm kho hàng</h4>
        )}
        <AddWarehouseContent
          open={open}
          onClose={onClose}
          onSuccess={onSuccess}
          warehouseSelected={warehouseSelected}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseDialog;
